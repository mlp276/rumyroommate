const { initiateDBConnection, queryError } = require('../databaseserver/connect_db.js');
const { host, user, password, database } = require('../projectspecs/sqlDatabaseSecrets.js');
const { useraccounts, userpreferences, createdroommatelistings, savedroommatelistings, matchingnotifications } = require('../databasespecs/sqlDatabaseSpecs.js');

const getListings = async function (request, response) {
    let userid = await request.query.userid;

    let sqlStatement = `SELECT * FROM ${createdroommatelistings}`;
    /* If userid is not defined, get all listings; otherwise, get listings of the user */
    if (userid !== undefined) {
        sqlStatement = sqlStatement.concat(` WHERE userid = ${userid}`);
    }
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
                        response.status(404).send('Listings of user not found.');
                        dbConnection.end();
                        return;
                    }

                    response.set('content-type', 'application/json');
                    response.status(200).send(JSON.stringify({ listings: jsonResult }));
                }
                dbConnection.end();
            });
        });
    }
    catch (error) { // Server errors
        response.status(500).send('Server Error');
    }
};

module.exports = {
    getListings
};