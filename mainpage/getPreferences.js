const { initiateDBConnection, queryError } = require('../databaseserver/connect_db.js');
const { getPreferenceColumn } = require('./getPreferenceID.js');
const { host, user, password, database } = require('../projectspecs/sqlDatabaseSecrets.js');
const { useraccounts, userpreferences, createdroommatelistings, savedroommatelistings, matchingnotifications } = require('../databasespecs/sqlDatabaseSpecs.js');

const getPreferences = function (request, response, userid, preferenceid) {
    if (userid === undefined || preferenceid === undefined) {
        response.status(500).send('Required queries not given');
        return;
    }

    let sqlStatement = '';
    const dbConnection = initiateDBConnection(host, user, password, database);

    let preferenceColumn = null;
    try {
        preferenceColumn = getPreferenceColumn(preferenceid);
        if (preferenceColumn === undefined) throw Error('Unknown Error');
    }
    catch (exception) {
        response.status(500).send('Bad Query');
        return;
    }

    try {
        sqlStatement = `SELECT ${preferenceColumn} FROM ${userpreferences} WHERE userid = ${userid}`;
        
        dbConnection.connect(function (error) {
            if (error) throw error;

            dbConnection.query(sqlStatement, function (error, result) {
                if (error) { // Unsuccessfuly Query
                    responseMessage = queryError(error, 'Service Unavailable');
                    response.status(503).send(responseMessage);
                }
                else { // Successful Query
                    const preferenceJSON = { 'preference': JSON.parse(JSON.stringify(result))[0][`${preferenceColumn}`] };
                    response.set('content-type', 'application/json');
                    response.status(200).send(JSON.stringify(preferenceJSON));
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
    getPreferences
};