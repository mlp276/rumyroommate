const { initiateDBConnection, queryError } = require('../../databaseserver/connect_db.js');
const { host, user, password, database } = require('../../projectspecs/sqlDatabaseSecrets.js');
const { useraccounts, userpreferences, createdroommatelistings, savedroommatelistings, matchingnotifications } = require('../../databasespecs/sqlDatabaseSpecs.js');
const { json } = require('body-parser');

const mock_getAccount = function (request, response, userid) {
    if (userid === undefined) {
        response.status(500).send('Required userid query not given');
        return;
    }

    let sqlStatement = `SELECT * FROM ${useraccounts} WHERE userid = ${userid}`
    const dbConnection = initiateDBConnection(host, user, password, database);

    try {
        /* Connect to the database to make queries */
        dbConnection.connect(function (error) {
            if (error) throw error; // Server error

            /* Execute the SQL statement */
            dbConnection.query(sqlStatement, function (error, result) {
                if (error) { // Unsuccessfuly Query
                    responseMessage = queryError(error, 'Service Unavailable');
                    response.status(503).send(responseMessage);
                }
                else { // Successful Query                    
                    const jsonResult = JSON.parse(JSON.stringify(result));

                    /* Determine if the record with userid was found */
                    if (jsonResult.length === 0) {
                        response.status(500).send('User account not found.');
                        return;
                    }

                    response.set('content-type', 'application/json');
                    response.status(200).send(JSON.stringify({ account: jsonResult[0] }));
                }
                dbConnection.end();
            });
        });
    }
    catch (error) { // Server errors
        console.error('Error: ' + error);
        response.status(500).send('Server Error');
    }
};

module.exports = {
    mock_getAccount
};