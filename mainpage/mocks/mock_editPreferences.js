const { initiateDBConnection, queryError } = require('../../databaseserver/connect_db.js');
const { getPreferenceColumn } = require('../getPreferenceID.js');
const { host, user, password, database } = require('../../databasespecs/sqlDatabaseSecrets.js');
const { useraccounts, userpreferences, createdroommatelistings, savedroommatelistings, matchingnotifications } = require('../../databasespecs/sqlDatabaseSpecs.js');

const mock_editPreferences = function (request, response) {
    let sqlStatement = '';
    const dbConnection = initiateDBConnection(host, user, password, database);

    try {
        const userid = request.body.userid;
        const preferenceid = request.body.preferenceid;
        const preferenceColumn = getPreferenceColumn(preferenceid);
        const preferenceValue = request.body.preferenceValue;
        sqlStatement = `UPDATE ${userpreferences} SET ${preferenceColumn} = \'${preferenceValue}\' WHERE userid = ${userid}`;
        
        dbConnection.connect(function (error) {
            if (error) throw error;

            dbConnection.query(sqlStatement, function (error, result) {
                if (error) { // Unsuccessfuly Query
                    responseMessage = queryError(error, 'Service Unavailable');
                    response.status(503).send(responseMessage);
                }
                else { // Successful Query
                    response.status(200).send('Preference successfully edited');
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
    mock_editPreferences
};