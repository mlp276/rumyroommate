const { initiateDBConnection, queryError } = require('../databaseserver/connect_db.js');
const { host, port } = require('../databaseserver/serverSpecs.js');
const { useraccounts, userpreferences, createdroommatelistings, savedroommatelistings, matchingnotifications } = require('../databasespecs/sqlDatabaseSpecs.js');
const { getPreferenceColumn } = require('./getPreferenceID.js');

/* UC-03 */
/* Query 1: Gets the input `userid`'s preference value, `user_preference_value` */
/* Query 2: Gets listings with the input `preferenceid` set from `preferenceids`
    This will be done by 
        1) Get the `userid` and `preferenceids` from all of the listings from the created listings
        2) Check if `preferenceid` is within each listing's `preferenceids`
        3) Count the listings that has the comparison successful, and return the array
    */
/* Query 3: From the array of listings from Query 2, use each of their `userid` to get from
    their preferences with the input `preferenceid` to get a list of `listing_preference_value`s */
/* Count the listings of `listing_preference_value` with the same as `user_preference_value` */
/* Return JSON of listings that hold these comparisons. */

const searchListings = async function (request, response, input_userid, input_preferenceid) {
    if (input_userid === undefined || input_preferenceid === undefined) {
        response.status(500).send('Bad Query');
        return;
    }
    
    /*  */
    let input_preferenceValue;
    const input_preferenceColumn = getPreferenceColumn(input_preferenceid);
    try {
        const responseResult = await fetch(`http://${host}:${port}/preferences?userid=${input_userid}&preferenceid=${input_preferenceid}`);
        if (!responseResult.ok) {
            response.status(500).send('/preferences error');
            return;
        }

        const responseJSON = await responseResult.json();
        input_preferenceValue = responseJSON[input_preferenceColumn];
    }
    catch {
        response.status(500).send('Server Error: fetch error');
        return;
    }

    /* Retrieves */
    let allListings;
    try {
        const responseResult = await fetch(`http://${host}:${port}/listings`);
        if (!responseResult.ok) {
            response.status(500).send('/listings error');
            return;
        }

        const responseJSON = await responseResult.json();
        allListings = responseJSON;

        
    }
    catch {
        response.status(500).send('Server Error: fetch error');
        return
    }

    /* Get listings that match input_preferenceValue */
    let matchingListings = [];
    for (const listing of allListings) {
        const listing_userid = listing.userid;
        const preferenceids = listing.preferenceids

        //Parse Preference ID's; Expected input format: "01,02,03"
        const prefIDArray = preferenceids.split(',');
        
        //If preference id found
        const formattedPreferences = String(input_preferenceid)
        if(prefIDArray.includes(formattedPreferences)) {
            try {
                const responseResult = await fetch(`http://${host}:${port}/preferences?userid=${listing_userid}&preferenceid=${input_preferenceid}`);
                if (!responseResult.ok) continue; 

                const responseJSON = await responseResult.json();
                const listing_preference_value = responseJSON.preference;

                if (listing_preference_value === input_preferenceValue) {
                    matchingListings.push(listing);
                }
            }
            catch{
                continue;
            }
        }
    }

    response.setHeader('Content-Type', 'application/json');
    response.status(200).send(JSON.stringify(matchingListings));
    console.log("Matched Listings: ", matchingListings);

};



module.exports = {
    searchListings
};
