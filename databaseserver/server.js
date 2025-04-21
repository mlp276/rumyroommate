const express = require('express'); // The express module for server set-up
const mainpage = require('../mainpage/mainpageOperations.js'); // Main page operations

const port = 8080;

const initializeServer = function () {
    const rumyroommateserver = express(); // The router for the server

    rumyroommateserver.get('/listings', function (request, response) {
        const userid = request.query.userid;
        const preferenceid = request.query.preferenceid;
        mainpage.getListings(request, response);
    });

    rumyroommateserver.get('/listings/search', function (request, response) {
        const userid = request.query.userid;
        const preferenceid = request.query.preferenceid;
        mainpage.searchListings(request, response, userid, preferenceid);
    });

    rumyroommateserver.get('/preferences', function (request, response) {
        const userid = request.query.userid;
        const preferenceid = request.query.preferenceid;
        mainpage.getPreferences(request, response, userid, preferenceid);
    });

    /* Listen to requests at the specified port */
    rumyroommateserver.listen(port);
    console.log(`Server started on port ${port}`);

    return rumyroommateserver;
};

module.exports = {
    initializeServer
};