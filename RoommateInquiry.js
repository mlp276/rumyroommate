//This is the Roommate Inquiry Page <3
//Operations for UC-06 and UC-07
//access the database and server 
const http = require('http');
const { initiateDBConnection, queryError } = require('../databaseserver/connect_db.js');
const { host, user, password, database } = require('../databasespecs/sqlDatabaseSecrets.js');

//Post id
//the User id who created it
//Title
//Description of the post
//Number of
