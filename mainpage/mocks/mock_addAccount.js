const { initiateDBConnection, queryError } = require('../../databaseserver/connect_db.js');
const { host, user, password, database } = require('../../databasespecs/sqlDatabaseSecrets.js');
const { useraccounts, userpreferences, createdroommatelistings, savedroommatelistings, matchingnotifications } = require('../../databasespecs/sqlDatabaseSpecs.js');

const mock_addAccount = function (request, response) {
    let sqlStatement = '';
    const dbConnection = initiateDBConnection(host, user, password, database);

    try {
        const netid = request.body.netid;
        const password = request.body.password;
        sqlStatement = `INSERT INTO ${useraccounts} (netid, password) VALUES (\'${netid}\', \'${password}\')`;
        
        dbConnection.connect(function (error) {
            if (error) throw error;

            dbConnection.query(sqlStatement, function (error, result) {
                if (error) { // Unsuccessfuly Query
                    responseMessage = queryError(error, 'Service Unavailable');
                    response.status(503).send(responseMessage);
                }
                else { // Successful Query
                    response.status(200).send('Account successfully added');
                }
                dbConnection.end();
            });
        });
    }
    catch (exception) {
        console.log(exception);
        response.status(500).send('Server Error');
    }
};

module.exports = {
    mock_addAccount
};