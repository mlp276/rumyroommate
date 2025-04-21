const { initiateDBConnection, queryError } = require('../databaseserver/connect_db.js');
const { host, user, password, database } = require('../databasespecs/sqlDatabaseSecrets.js');
const { useraccounts, userpreferences, createdroommatelistings, savedroommatelistings, matchingnotifications } = require('../databasespecs/sqlDatabaseSpecs.js');

const searchListings = async function (request, response, userid, preferenceid) {
    if (userid === undefined || preferenceid === undefined) {
        response.status(500).send('Bad Query');
        return;
    }

    const dbConnection = initiateDBConnection(host, user, password, database);

    try {
        const responseListings = await fetch('http://localhost:8080/listings');
        if (!responseListings.ok) {
            response.status(500).send('Server Error: /listings error');
        }

        const json = await responseListings.json();
        console.log(json);
        response.status(200).send('Retrieved Listings.');
    }
    catch {
        response.status(500).send('Server Error');
    }
};

module.exports = {
    searchListings
};