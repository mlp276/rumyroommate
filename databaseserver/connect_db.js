const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: "localhost",
    user: "yourSQLUser",
    password: "yourSQLPassword",
    database: "demo"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});