var imputeTimeCalc = require("./imputeTimeCalc");
var travelTimeCalc = require("./travelTimeCalc");
var latLongDist = require("./latLongDist");
var zipcodeToCoordinate = require("./zipcodeToCoordinates");
var minutesAfterDayStart = require('./minutesAfterDayStart');
var csvFile = './server/Util/MA_zipcodes.csv'

//Checks if a given time is later than the time value of last, and if so, updates the zip and time
// of last
function checkIfLater(last, time, zip) {
    if (last.time < time) {
        last = {zip: zip, time: time};
    }
    return last;
}

//gets the last drop and returns the location as zip and the time from 5AM.
function lastDrop(cluster) {
    //keep track of the zip code and the latest drop time as time from 5AM.
    var lastDrop = {zip: "Error", time: -1};
    //Check the drop time of all zips
    for (var i = 0; i < cluster.trips.length; i++) {
        //Case that the dropoff time is known
        if (cluster['trips'][i]['anchor'] == 'A') {
            lastDrop = checkIfLater(lastDrop, minutesAfterDayStart(cluster['trips'][i]['requestTime']),
                cluster['trips'][i]['dropZip']);
        }
        //Case the drop off time is not known
        else {
            lastDrop = checkIfLater(lastDrop, minutesAfterDayStart(parseInt(imputeTimeCalc(cluster['trips'][i],
                csvFile))), cluster['trips'][i]['dropZip']);
        }
    }
    return lastDrop;
}

//Adds the cluster of trips to routes, if the cluster contians more than 1 trip it will be added to
// an existing trip if possible or create a new route i.e. get to the cluster before 'start' time,
// else it is added as a stand alone trip
function addCluster(routes, cluster, start) {
    //Case there are standalone trips, do not add to a route
    if (cluster.trips.length == 1) {
        return routes.alone.push(cluster.trips[0]);
    }
    else {
        //Find the minimum dead head time between the end of a route and a cluster
        var minDead = Number.MAX_VALUE;
        var routeToAdd = -1;
        for (var i = 0; i < routes.routes.length; i++) {
            //get the coordinates for the zip-codes
            var clusterCoords = zipcodeToCoordinate(csvFile, parseInt(cluster.zip));
            var routeCoords = zipcodeToCoordinate(csvFile, parseInt(routes.routes[i].zip));
            //find the time between the two
            var deadHead = travelTimeCalc(latLongDist(clusterCoords.latitude, clusterCoords.longitude,
                routeCoords.latitude, routeCoords.longitude), 50);
            //The arrival to the pick up of the cluster
            var arrival = routes['routes'][i]['time'] + deadHead;
            //Check arrive on time and that it minimizes dead head time
            if (arrival < start && start - arrival < minDead) {
                minDead = deadHead;
                routeToAdd = i;
            }
        }

        //Add the cluster to the right route
        var lastDropCluster = lastDrop(cluster);
        //new route
        if (routeToAdd == -1) {
            routes.routes.push({zip: lastDropCluster.zip, time: lastDropCluster.time,
                clusters: [cluster]});
        }
        //add to existing route and update
        else {
            var route = routes['routes'][routeToAdd];
            route.zip = lastDropCluster.zip;
            route.time = lastDropCluster.time;
            route.clusters.push(cluster);
        }
        return routes;
    }
}

/*
    From a set of clustered routes, create routes where a route is a continuation of clusters, each
    cluster is completed before starting the next segment of the route.  Clusters are only added to
    a route if they contain more than one trip to limit the amount of single passenger vehicles in
    use. A cluster is added to the existing route which minimizes dead head time for that route.
    An Example route is {routes: [... {zip: , time:, clusters[...]) ...], alone [... cluster ...]}
 */
function linkClusters(input) {
    //default route structure
    var routes = {routes : [], alone: []};
    //For each time slice add clusters to routes
    for(var i = 0; i < input.groups.length; i++) {
        //For a given time add clusters to routes
        for(var j = 0; j < input['groups'][i]['clusters'].length; j++) {
            addCluster(routes, input['groups'][i]['clusters'][j], input['groups'][i]['start']);
        }
    }
    return routes;
}

module.exports = linkClusters;