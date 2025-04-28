const { initiateDBConnection, queryError } = require('../../databaseserver/connect_db.js');
const { host, user, password, database } = require('../../projectspecs/sqlDatabaseSecrets.js');
const { useraccounts, userpreferences, createdroommatelistings, savedroommatelistings, matchingnotifications } = require('../../databasespecs/sqlDatabaseSpecs.js');

const mock_addListing = function (request, response) {
    let sqlStatement = '';
    const dbConnection = initiateDBConnection(host, user, password, database);

    try {
        const userid = request.body.userid;
        const preferenceids = request.body.preferenceids;
        const createtime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const address = request.body.address;
        sqlStatement = sqlStatement.concat(`INSERT INTO ${createdroommatelistings} (userid, preferenceids, createtime, address)`);
        sqlStatement = sqlStatement.concat(`VALUES (${userid}, \'${preferenceids}\', \'${createtime}\', \'${address}\')`);
        
        dbConnection.connect(function (error) {
            if (error) throw error;

            dbConnection.query(sqlStatement, function (error, result) {
                if (error) { // Unsuccessfuly Query
                    responseMessage = queryError(error, 'Service Unavailable');
                    response.status(503).send(responseMessage);
                }
                else { // Successful Query
                    response.status(200).send('Successfully added listing');
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
    mock_addListing
};