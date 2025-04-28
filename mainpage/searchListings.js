const { host, port } = require('../projectspecs/serverSpecs.js');

const searchListings = async function (request, response, userid, preferenceid) {
    if (userid === undefined || preferenceid === undefined) {
        response.status(500).send('Bad Query');
        return;
    }

    let response_getPreferences;
    let response_getListings;
    let responseJSON;

    response_getPreferences = await fetch(`http://${host}:${port}/preferences?userid=${userid}&preferenceid=${preferenceid}`);
    if (!response_getPreferences.ok) {
        response.status(500).send('./listings/search error: Unable to get the user\'s preferences');
        return;
    }
    responseJSON = await response_getPreferences.json();
    const preferenceValue = responseJSON.preference;

    response_getListings = await fetch(`http://${host}:${port}/listings`);
    if (!response_getListings.ok) {
        response.status(500).send('./listings/search error: Unable to get listings');
        return;
    }
    responseJSON = await response_getListings.json();

    let considered_listings = [];
    for (const listing of responseJSON.listings) {
        listing_userid = parseInt(listing.userid);
        listing_preferenceids = listing.preferenceids.split(',');
        if (listing_userid !== userid && listing_preferenceids.find((listing_preferenceid) => parseInt(listing_preferenceid) === preferenceid) !== undefined) {
            considered_listings.push(listing);
        }
    }

    let matched_listings = [];
    for (const listing of considered_listings) {
        listing_userid = listing.userid;

        response_getPreferences = await fetch(`http://${host}:${port}/preferences?userid=${listing_userid}&preferenceid=${preferenceid}`);
        if (!response_getPreferences.ok) {
            response.status(500).send('./listings/search error: Unable to get the listing\'s preferences');
            return;
        }
        
        responseJSON = await response_getPreferences.json();
        listing_preferenceValue = responseJSON.preference;

        if (listing_preferenceValue === null) continue;

        if (listing_preferenceValue.endsWith(preferenceValue)) {
            matched_listings.push(listing);
        }
    }

    response.set('content-type', 'application/json');
    response.status(200).send(JSON.stringify({ matched_listings: matched_listings }));
};

module.exports = {
    searchListings
};