const http = require('http');
const { initiateDBConnection, queryError } = require('../databaseserver/connect_db.js');
const { host, user, password, database } = require('../databasespecs/sqlDatabaseSecrets.js');

/*
    Main Page Operations:
    OP-04: Get Preference Value
    OP-06: Get Listing
    OP-09: Get Saved Listing
    OP-10: Add Saved Listing
    OP-11: Remove Saved Listing
    OP-12: Get Notification

    Main Page Use Cases:
    UC-03: Search Roommate Listing
    UC-04: Save Roommate Listing
    UC-05: View Match Notification

*/s