const { initiateDBConnection, queryError } = require('../databaseserver/connect_db.js');
const { host, user, password, database } = require('../databasespecs/sqlDatabaseSecrets.js');
const { useraccounts, userpreferences, createdroommatelistings, savedroommatelistings, matchingnotifications } = require('../databasespecs/sqlDatabaseSpecs.js');

const getListings = function (request, response) {
    let sqlStatement = '';
    const dbConnection = initiateDBConnection(host, user, password, database);

    try {
        sqlStatement = `SELECT * FROM ${createdroommatelistings}`;

        dbConnection.connect(function (error) {
            if (error) throw error;

            dbConnection.query(sqlStatement, function (error, result) {
                if (error) { // Unsuccessfuly Queryr
                    responseMessage = queryError(error, 'Service Unavailable');
                    response.status(503).send(responseMessage);
                }
                else { // Successful Query
                    const listingsJSON = { listings: JSON.parse(JSON.stringify(result)) };
                    response.set('content-type', 'application/json');
                    response.status(200).send(JSON.stringify(listingsJSON));
                }
                dbConnection.end();
            });
        });
    }
    catch (exception) {
        response.status(500).send('Server Error');
    }
};

module.exports = {
    getListings
};