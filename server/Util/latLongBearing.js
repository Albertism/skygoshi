
/*
Found reference material on bearing calculation from :
https://www.movable-type.co.uk/scripts/latlong.html
Function based on the formulas from the above link.
Note going East/West while not at the equator will change latitude,
likewise a change only in longitude while not at the equator will not reslt in 0/270 deg
Returns the bearing in degrees between two latitude/longitude points given in degrees.
*/
function latLongBearing(sourceLat, sourceLong, destLat, destLong) {

    var sLat = sourceLat * Math.PI / 180;
    var sLong = sourceLong * Math.PI / 180;
    var dLat = destLat * Math.PI / 180;
    var dLong = destLong * Math.PI / 180;

    var y = Math.cos(dLat)* Math.sin(dLong - sLong);
    var x = Math.cos(sLat) * Math.sin(dLat) - Math.sin(sLat) *
        Math.cos(dLat) * Math.cos(dLong - sLong);

    var b = Math.atan2(y ,x);
    b = b * 180 / Math.PI;

    //go from -180 to 180 to 0 to 360
    return (b + 360) % 360;
}

module.exports = latLongBearing;