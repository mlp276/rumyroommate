const mysql = require('mysql2');

const initiateDBConnection = function (host, user, password, database) {
    /* Creates a connection to the SQL database */
    const connection = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    });
    return connection;
};

const queryError = function(error, code, message) {
    responseMessage.code = code;
    responseMessage.message = message;
    responseMessage.body = "MySQL server error: CODE = " + error.code
                         + " SQL of the failed query: "  + error.sql
                         + " Textual description: "      + error.sqlMessage;
    return responseMessage;
};

module.exports = {
    initiateDBConnection,
    queryError
};