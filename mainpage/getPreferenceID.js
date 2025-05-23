const preferenceIDs = [
    null,
    'gender',
    'major',
    'prefrace',
    'prefreligion',
    'prefsmoking',
    'prefdrinking',
    'sleephabits',
    'sleepstarttime',
    'sleependtime',
    'studystarttime',
    'studyendtime',
    'sharedstarttime',
    'sharedendtime',
    'roombudget',
    'preflowtemp',
    'prefhightemp',
    'prefguestfreq',
    'cleanliness',
    'noisetolerance'
];

const validatePreferenceID = function (preferenceid) {
    if (preferenceid < 0) throw Error();
    if (preferenceid >= preferenceIDs.length) throw Error();
}

const getPreferenceColumn = function (preferenceid) {
    validatePreferenceID(preferenceid);
    return preferenceIDs[preferenceid];
};

module.exports = {
    getPreferenceColumn
};