const { initiateDBConnection, queryError } = require('../../databaseserver/connect_db.js');
const { host, user, password, database } = require('../../databasespecs/sqlDatabaseSecrets.js');
const { useraccounts, userpreferences, createdroommatelistings, savedroommatelistings, matchingnotifications } = require('../../databasespecs/sqlDatabaseSpecs.js');

const mock_removeListing = function (request, response) {
    let sqlStatement = '';
    const dbConnection = initiateDBConnection(host, user, password, database);

    try {
        const postid = request.body.postid;
        sqlStatement = `DELETE FROM ${createdroommatelistings} WHERE postid = ${postid}`;
        
        dbConnection.connect(function (error) {
            if (error) throw error;

            dbConnection.query(sqlStatement, function (error, result) {
                if (error) { // Unsuccessfuly Query
                    responseMessage = queryError(error, 'Service Unavailable');
                    response.status(503).send(responseMessage);
                }
                else { // Successful Query
                    response.status(200).send('Successfully removed listing');
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
    mock_removeListing
};