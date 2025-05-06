//This is the Roommate Inquiry Page <3
//Operations UC-06 and UC-07
//access the database and server 
const http = require('http');
const { initiateDBConnection, queryError } = require('../databaseserver/connect_db.js');
const { host, user, password, database } = require('../databasespecs/sqlDatabaseSecrets.js');

//Post id
//User id
//Title
//Description
//Number of
