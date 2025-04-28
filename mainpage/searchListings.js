const { host, port } = require('../projectspecs/serverSpecs.js');

const searchListings = async function (request, response, userid, preferenceid) {
    if (userid === undefined || preferenceid === undefined) {
        response.status(500).send('Bad Query');
        return;
    }

    userid = parseInt(userid);
    preferenceid = parseInt(preferenceid);
    let response_getPreferences;
    let response_getListings;
    let responseJSON;

    /* Get the user's preference, if the userid given exists in the database */
    response_getPreferences = await fetch(`http://${host}:${port}/preferences?userid=${userid}&preferenceid=${preferenceid}`);
    if (!response_getPreferences.ok) {
        const errorText = await response_getPreferences.text();
        response.status(500).send(errorText);
        return;
    }
    responseJSON = await response_getPreferences.json();
    const preferenceValue = responseJSON.preference;

    /* Request to not filter listings, rather get all available listings that is not own user's */
    if (preferenceid === 0) {
        response_getListings = await fetch(`http://${host}:${port}/listings`);
        if (!response_getListings.ok) {
            const errorText = await response_getPreferences.text();
            response.status(500).send(errorText);
            return;
        }
        let json = await response_getListings.json();

        let matched_listings = [];
        for (const listing of json.listings) {
            listing_userid = parseInt(listing.userid);
            if (listing_userid !== userid) {
                matched_listings.push(listing);
            }
        }

        response.set('content-type', 'application/json');
        response.status(200).send(JSON.stringify({ matched_listings: matched_listings }));
        return;
    }

    /* Get all avaialble listings */
    response_getListings = await fetch(`http://${host}:${port}/listings`);
    if (!response_getListings.ok) {
        const errorText = await response_getPreferences.text();
        response.status(500).send(errorText);
        return;
    }
    responseJSON = await response_getListings.json();

    /* Get only the listings with the set preference ids the same as the requesting preference id */
    let considered_listings = [];
    for (const listing of responseJSON.listings) {
        listing_userid = parseInt(listing.userid);
        listing_preferenceids = listing.preferenceids.split(',');
        if (listing_userid !== userid && listing_preferenceids.find((listing_preferenceid) => parseInt(listing_preferenceid) === preferenceid) !== undefined) {
            considered_listings.push(listing);
        }
    }

    /* Get each listing's preference based on their userid, then include those matching with
       the requesting user's preference */
    let matched_listings = [];
    for (const listing of considered_listings) {
        listing_userid = listing.userid;

        response_getPreferences = await fetch(`http://${host}:${port}/preferences?userid=${listing_userid}&preferenceid=${preferenceid}`);
        if (!response_getPreferences.ok) {
            const errorText = await response_getPreferences.text();
            response.status(500).send(errorText);
            return;
        }
        
        responseJSON = await response_getPreferences.json();
        listing_preferenceValue = responseJSON.preference;

        if (listing_preferenceValue === null) continue;

        if (listing_preferenceValue.endsWith(preferenceValue)) {
            matched_listings.push(listing);
        }
    }

    /* Send the matching listings to the requesting user */
    response.set('content-type', 'application/json');
    response.status(200).send(JSON.stringify({ matched_listings: matched_listings }));
};

module.exports = {
    searchListings
};