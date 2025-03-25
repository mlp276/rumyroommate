const express = require('express'); // The express module for server routing
const route = express(); // The router for the server

const mainpage = require('../mainpage/mainpageOperations.js');

route.get('/accounts', function (request, response) {
    mainpage.getAccounts(request, response);
});

route.get('/listings', function (request, response) {
    mainpage.viewListings(request, response);
});

/* Listen to requests at port 8080 */
const port = 8080;
route.listen(port);
console.log(`Server started on port ${port}`);