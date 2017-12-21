var linkCLusters = require("./linkClusters");
var clusterTrips = require("./clusterTimeSlices");
var sliceTripsByTime = require("./sliceTripsByTime");

/*
The algorithm which takes an array of parsed trips, as json objects as specified in tripParser.js,
Groups them by time and location.  The algorithm then links together the groups where the end of one
group can lead to another, minimizing dead head time. Groups of size 1 have their trips added to an
array of standalone trips to be serviced by a third party.
Parameters:
input: the array of parsed trips.
sliceTime: the duration in minutes to initially separate pickup times by
clusterTime: the maximum time between trips, such that they will be grouped
bearingDiff: the maximum difference in bearing between two trips such that they will be grouped
 */

function tripAlgorithm(input, sliceTime, clusterTime, bearingDiff) {
  return linkCLusters(clusterTrips(sliceTripsByTime(input, sliceTime), clusterTime, bearingDiff)) ;
}

module.exports = tripAlgorithm;