const mysql = require('mysql2');

/* Creates a connection to the SQL database */
const connection = mysql.createConnection({
    host: "localhost",
    user: "yourSQLUser",
    password: "yourSQLPassword",
    database: "demo"
});

/* Establishes the connection and perform tasks upon success */
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

