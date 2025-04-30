/* Main Page Controllers */
const { getListings } = require('./getListings.js');               // OP-03: Get Listings
const { getPreferences } = require('./getPreferences.js');         // OP-05: Get Preferences
const { mock_addListing } = require('./mocks/mock_addListing.js'); // Mock OP-06: Add Listings
const { searchListings } = require('./searchListings.js');         // UC-03: Search Listings
const { mock_getAccount } = require('./mocks/mock_getAccount.js');

module.exports = {
    getListings,
    getPreferences,
    searchListings,
    mocks: {
        mock_addListing,
        mock_getAccount
    }
};