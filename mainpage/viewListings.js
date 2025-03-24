const { getPreference } = require('./preferenceIDs.js');
const { initiateDBConnection, queryError } = require('../databaseserver/connect_db.js');
const { host, user, password, database } = require('../databasespecs/sqlDatabaseSecrets.js');

const getPreferenceValue = function (userid, preferenceid) {
    let sqlStatement = '';
    let preferenceValue = getPreference(preferenceid);
    let preferenceTable = 'userpreferences';
    const dbConnection = initiateDBConnection(host, user, password, database);

    try {
        dbConnection.connect(function (error) {
            if (error) throw error;

            sqlStatement = `SELECT ${preferenceValue} FROM ${preferenceTable} WHERE userid=${userid}`;
            dbConnection.query(sqlStatement, function (error, result) {
                if (error) {
                    return 'Service Unavailable';
                }
                dbConnection.end();
                return JSON.stringify(JSON.parse(JSON.stringify(result)));
            });

        });
    }
    catch (exception) {
        return 'Server Error'
    }
};

const viewListings = function () {
    let sqlStatement = '';
    let preferenceTable = 'createdroommatelistings';
    const dbConnection = initiateDBConnection(host, user, password, database);

    try {
        dbConnection.connect(function (error) {
            if (error) throw error;

            sqlStatement = `SELECT * FROM ${preferenceTable}`;
            dbConnection.query(sqlStatement, function (error, result) {
                if (error) {
                    return 'Service Unavailable';
                }
                dbConnection.end();
                return JSON.stringify(JSON.parse(JSON.stringify(result)));
            });

        });
    }
    catch (exception) {
        return 'Server Error'
    }
};

console.log(getPreferenceValue(10, 2));
console.log(viewListings());