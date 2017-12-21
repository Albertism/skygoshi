//Converts number to radians for use in latLongDist calculation
function toRad(number) {
    return number * Math.PI / 180;
}

//Haversine formula
//Found awesome reference material here: https://www.movable-type.co.uk/scripts/latlong.html
//Function based on the formulas from the link above
//Returns a distance in meters between the two points
function latLongDist(sourceLat, sourceLong, destinationLat, destinationLong) {

    var R = 6371e3; // meters
    var φ1 = toRad(sourceLat);
    var φ2 = toRad(destinationLat);
    var Δφ = toRad(destinationLat-sourceLat);
    var Δλ = toRad(destinationLong-sourceLong);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return d;

}

module.exports = latLongDist;