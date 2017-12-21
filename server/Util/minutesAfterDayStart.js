//Get the time in minutes from start time, assumed to be 5AM, as stored
// as string in form HHMM
function timeAsMinutesFromStart(time) {
    time = "" + time;
    var mins = parseInt(time.substring(time.length - 2));
    var hours = 0
    if (time.length > 2) {
        var hours = parseInt(time.substring(0, time.length - 2));
    }
    var result = mins;

    if(hours < 5) {
        //24 hours in a day - 5AM is 19 hours
        result += 19 * 60 + hours * 60;
    }
    else {
        //Can calculate time as difference from 5AM
        result += (hours - 5) * 60;
    }
    return result;
}

module.exports = timeAsMinutesFromStart;