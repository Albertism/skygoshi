//Calculate the time to travel the given distance at the given speed
//Takes a distance in meters(such as the output of latLongDist())
//and a speed in km/h
//Returns number of minutes
function travelTimeCalc(distance, speed) {
    distKm = distance/1000;
    travelTime = distKm/speed;
    travelTimeMin = travelTime *60;
    return travelTimeMin;
}

module.exports = travelTimeCalc;