var zipToCoord = require("./zipcodeToCoordinates");
var bearing = require("./latLongBearing");
var travelTime = require("./travelTimeCalc");
var csvPath = "./server/Util/MA_zipcodes.csv";
var distance = require("./latLongDist");

// From an array of trips, clusters trips which are withing a tolerance calculated time apart ,
// tolTime, and a bearing tolerance difference, tolBearing
function makeClusters(trips, tolBearing, tolTime) {
    var clusters = [];
    for (var i = 0; i < trips.length; i++) {
        //Get the pickup an dropoff coordinates
        var pickCoods = zipToCoord(csvPath, parseInt(trips[i].pickZip));
        var dropCoords = zipToCoord(csvPath, parseInt(trips[i].dropZip));

        //check all existing clusters
        var foundCluster = false;
        for (var j = 0; j < clusters.length; j++) {
            var clustCoords = zipToCoord(csvPath, parseInt(clusters[j]['zip']));
            //check if trip fits in the cluster
            if (Math.abs(clusters[j].bearing - bearing(pickCoods.latitude, pickCoods.longitude,
                    dropCoords.latitude, dropCoords.longitude)) <= tolBearing
                && travelTime(distance(pickCoods.latitude, pickCoods.longitude, clustCoords.latitude,
                    clustCoords.longitude), 30)  <= tolTime) {
                clusters[j]['trips'].push(trips[i]);
                foundCluster = true;
                break;
            }
        }
        //case trip does not fit into an existing cluster
        if (!foundCluster) {
            clusters.push({
                bearing: bearing(pickCoods.latitude, pickCoods.longitude,
                    dropCoords.latitude, dropCoords.longitude),
                zip: trips[i].pickZip, trips: [trips[i]]
            });
        }
    }
    return clusters;
}

//input
// { interval: X, groups: [{ start: 0X, trips: [t1, t2]},{ start: 1X, trips: []}]}
// output
//{ interval: X, groups: [ { start: 0X, clusters: [{bearing: Y, zip: "Z", trips: [t1, t2]}]} ...]}
//From an input of trips grouped by pickup time, and tolerances of bearing and proximity (in minutes)
//Returns the trips clustered together where possible.
function clusterTimeSlices(timeSlices, tolBearing, tolTime) {
    //make clusters for each time slice
    var groups = [];
    for (var i = 0; i < timeSlices.groups.length;  i++) {
        //check if time slice contains cluster
        if (timeSlices['groups'][i]['trips'].length > 0) {
            groups.push( {start: timeSlices['groups'][i]['start'],
                clusters: makeClusters(timeSlices['groups'][i]['trips'], tolBearing, tolTime)});
        }
    }

    //initial structure of json object
    var clusters = {interval: timeSlices.interval, groups: groups};
    return clusters;
}

module.exports = clusterTimeSlices;