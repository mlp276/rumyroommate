const { initiateDBConnection, queryError } = require('../databaseserver/connect_db.js');
const { host, user, password, database } = require('../projectspecs/sqlDatabaseSecrets.js');
const { useraccounts, userpreferences, createdroommatelistings, savedroommatelistings, matchingnotifications } = require('../databasespecs/sqlDatabaseSpecs.js');

/* List of implemented preferences and their associated ids */
const preferenceIDs = [
    null,
    'gender',
    'major',
    'prefrace',
    'prefreligion',
    'prefsmoking',
    'prefdrinking',
    'sleephabits',
    'sleepstarttime',
    'sleependtime',
    'studystarttime',
    'studyendtime',
    'sharedstarttime',
    'sharedendtime',
    'roombudget',
    'preflowtemp',
    'prefhightemp',
    'prefguestfreq',
    'cleanliness',
    'noisetolerance'
];

const getPreferenceColumn = function (preferenceid) {
    /* Check that the preference id is within the valid range */
    if (preferenceid < 0 || preferenceid >= preferenceIDs.length) {
        throw Error('Preference id Out of Range');
    }

    return preferenceIDs[preferenceid];
};

const getPreferences = function (request, response, userid, preferenceid) {
    /* Require that both userid and preferenceid be given */
    if (userid === undefined || preferenceid === undefined) {
        response.status(500).send('Required queries not given');
        return;
    }

    /* Get the preference column associated with preferenceid */
    let preferenceColumn = null;
    try {
        preferenceColumn = getPreferenceColumn(preferenceid);
    }
    catch (exception) {
        response.status(500).send('Bad Query');
        return;
    }

    /* SQL Query for the API Operation */
    const sqlStatement = `SELECT ${preferenceColumn} FROM ${userpreferences} WHERE userid = ${userid}`;
    const dbConnection = initiateDBConnection(host, user, password, database);

    try {
        /* Connect to the database to make queries */
        dbConnection.connect(function (error) {
            if (error) throw error; // Server Error

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
                        response.status(500).send('Preference of user not found.');
                        return;
                    }

                    /* Convert the JSON into the return object */
                    const preferenceJson = { 'preference': jsonResult[0][`${preferenceColumn}`] };                    
                    response.set('content-type', 'application/json');
                    response.status(200).send(JSON.stringify(preferenceJson));
                }
                dbConnection.end(); // Finished SQL 
            });
        });
    }
    catch (error) { // Server Errors
        console.error('Error: ' + error);
        response.status(500).send('Server Error');
    }
};

module.exports = {
    getPreferences
};