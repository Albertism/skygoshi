var pickUpTime = require('./imputeTimeCalc.js');
var timeAsMinutesFromStart = require('./minutesAfterDayStart');


//Adds a trip to a jsonObj at the given pickup time
//Adds the trip to the bin corresponding to the pickup time
function addToTimeSegment(jsonObj, pickup, trip) {
    for (j = 0; j < jsonObj['groups'].length; j++) {
        if (jsonObj['groups'][j]['start'] <= pickup
            && (j == jsonObj['groups'].length - 1
                || jsonObj['groups'][j + 1]['start'] > pickup)) {
            jsonObj['groups'][j]['trips'].push(trip);
            break;
        }
    }
    return jsonObj;
}

//Slice the set of trips into bins based upon a set amount of time
//Takes in an array of trips as a parsed as a JSON object and an amount of time
//to slice trips by in minutes
//Returns a JSON object of trips for each time, binned by minutes from 1 AM
function sliceTripsByTime(trips, time) {
    //Create json object
    var jsonObj = {interval: time, groups: []};
    var bin = 0;
    //create bins
    //There are 1200 minutes from 5AM to 1AM
    for (var i = 0; i < 1200; i += time) {
        jsonObj['groups'][bin]={start: i, trips: [] };
        bin++;
    }

    //Add trips to the bins - need to do a for-loop async
    for (i = 0; i < trips.length; i++) {
        if(trips[i]['anchor'] === 'A') {
            addToTimeSegment(jsonObj, timeAsMinutesFromStart(pickUpTime(trips[i],
                "./server/Util/MA_zipcodes.csv")), trips[i]);
        }
        else {
            addToTimeSegment(jsonObj, timeAsMinutesFromStart(trips[i]['requestTime']), trips[i]);
        }
    }
    return jsonObj;

}

module.exports = sliceTripsByTime;