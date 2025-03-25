const express = require('express'); // The express module for server set-up
const mainpage = require('../mainpage/mainpageOperations.js'); // Main page operations

const port = 8080;

const initializeServer = function () {
    const rumyroommateserver = express(); // The router for the server

    rumyroommateserver.get('/accounts', function (request, response) {
        mainpage.getAccounts(request, response);
    });

    rumyroommateserver.get('/listings', function (request, response) {
        mainpage.viewListings(request, response);
    });

    /* Listen to requests at the specified port */
    rumyroommateserver.listen(port);
    console.log(`Server started on port ${port}`);

    return rumyroommateserver;
};

initializeServer();