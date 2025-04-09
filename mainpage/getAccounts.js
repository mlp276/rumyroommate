const { initiateDBConnection } = require('../databaseserver/connect_db.js');
const { host, user, password, database } = require('../databasespecs/sqlDatabaseSecrets.js');

const getAccounts = function (request, response) {
    let requestMessage = {};
    let sqlStatement = '';

    const dbConnection = initiateDBConnection(host, user, password, database);
    let accountsTable = 'useraccounts';

    try {
        dbConnection.connect(function (error) {
            if (error) throw error;

            sqlStatement = `SELECT * FROM ${accountsTable}`;
            dbConnection.query(sqlStatement, function (error, result) {
                if (error) {
                    requestMessage.message = 'Service Unavailable';
                    requestMessage.body = 'MySQL server error: CODE = '
                        + error.code + ' SQL of the failed query: '
                        + error.sql + ' Textual description : ' + error.sqlMessage;
                    response.status(503).send(requestMessage);
                }
                else {
                    const resultJSON = JSON.stringify(JSON.parse(JSON.stringify(result)));
                    response.set('content-type', 'application/json')
                    response.status(200).send(resultJSON);
                    dbConnection.end();
                }
            });

        });
    }
    catch (exception) {
        response.status(500).send('Server Error');
    }
};

module.exports = {
    getAccounts
};