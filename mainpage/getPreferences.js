const { initiateDBConnection, queryError } = require('../databaseserver/connect_db.js');
const { getPreferenceColumn } = require('./getPreferenceID.js');
const { host, user, password, database } = require('../databasespecs/sqlDatabaseSecrets.js');
const { useraccounts, userpreferences, createdroommatelistings, savedroommatelistings, matchingnotifications } = require('../databasespecs/sqlDatabaseSpecs.js');

const getPreferences = function (request, response, userid, preferenceid) {
    let responseMessage = {}, sqlStatement = '';
    const dbConnection = initiateDBConnection(host, user, password, database);

    let inputUserPreferenceColumn = null;
    try {
        inputUserPreferenceColumn = getPreferenceColumn(preferenceid); 
    }
    catch (exception) {
        response.status(500).send('Bad Query');
        return;
    }

    sqlStatement = `SELECT ${inputUserPreferenceColumn} FROM ${userpreferences} WHERE userid = ${userid}`;

    try {
        dbConnection.connect(function (error) {
            if (error) throw error;
            dbConnection.query(sqlStatement, function (error, result) {
                if (error) { // Unsuccessfuly Query
                    responseMessage = queryError(error, 'Service Unavailable');
                    response.status(503).send(responseMessage);
                }
                else { // Successful Query
                    const queryResult = JSON.stringify(JSON.parse(JSON.stringify(result)));
                    response.set('content-type', 'application/json');
                    response.status(200).send(queryResult);
                }
                dbConnection.end();
            });
        });
    }
    catch (exception) {
        response.status(500).send('Server Error');
        return;
    }
};

module.exports = {
    getPreferences
};