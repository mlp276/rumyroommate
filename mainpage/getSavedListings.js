const { initiateDBConnection, queryError } = require('../databaseserver/connect_db.js');
const { host, user, password, database } = require('../databasespecs/sqlDatabaseSecrets.js');
const { createdroommatelistings, savedroommatelistings } = require('../databasespecs/sqlDatabaseSpecs.js');

const getSavedListings = function (request, response) {
    const dbConnection = initiateDBConnection(host, user, password, database);
    let responseMessage = {};

    // Get userID from query string
    const url = new URL(request.url, `http://${request.headers.host}`);
    const userID = parseInt(new URLSearchParams(url.search).get('userID'));

    if (!userID || userID <= 0) {
        responseMessage = { message: 'Invalid or missing userID' };
        return response.status(400).json(responseMessage);
    }

    const sqlStatement = `
        SELECT r.* FROM ${createdroommatelistings} r
        JOIN ${savedroommatelistings} s ON r.postid = s.postid
        WHERE s.userid = ?`;

    try {
        dbConnection.connect(function (error) {
            if (error) throw error;

            dbConnection.query(sqlStatement, [userID], function (error, result) {
                if (error) {
                    responseMessage = queryError(error, 'Service Unavailable');
                    response.status(503).send(responseMessage);
                } else {
                    response.set('content-type', 'application/json');
                    response.status(200).send(JSON.stringify({
                        message: result.length === 0 ? "No saved listings found" : "Success",
                        listings: result
                    }));
                }
                dbConnection.end();
            });
        });
    } catch (exception) {
        response.status(500).send('Server Error');
    }
};

module.exports = {
    getSavedListings
};
