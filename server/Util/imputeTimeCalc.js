var latLongDist = require("./latLongDist");
var travelTimeCalc = require("./travelTimeCalc");
var zipcodeToCoords = require("./zipcodeToCoordinates");

function estimateDropoffFromPickup(requestTime, travelTime) {

    var tripBuffer = 20;
    //Have to be careful incrementing the time since its a 24 hour clock
    //Split into hour and mins
    var requestHour = requestTime.toString().slice(0,requestTime.toString().length/2);
    var requestMin = requestTime.toString().slice(requestTime.toString().length/2);

    var minutes = parseInt(requestMin);
    requestHour = parseInt(requestHour);
    //Time to add to the requestTime
    var additionalTime = travelTime + tripBuffer;
    //Need to get hours and minutes
    hours = Math.floor((additionalTime)/60);
    extraMinutes = Math.floor(additionalTime - (hours * 60));
    //Add the mins
    if(extraMinutes + minutes >= 60){
        hours++;
        minutes = Math.floor((extraMinutes + minutes) % 60);
    }
    else {
        minutes += extraMinutes;
    }
    //Add the hours
    if(requestHour + hours < 24){
        requestHour += hours;
    }
    //Wrap around to the am
    else {
        requestHour = 0;
        hours--;
        requestHour += hours;

    }
    if(minutes<10){
        minutes = minutes.toString();
        minutes = "0" + minutes;
    }
    else {
        minutes = minutes.toString()
    }
    //Final time
    return requestHour.toString() + minutes;
}

function estimatePickupFromDropoff(requestTime, travelTime) {

    var tripBuffer = 20;
    //Have to be careful incrementing the time since its a 24 hour clock
    //Split into hour and mins
    var requestHour = requestTime.toString().slice(0,requestTime.toString().length/2);
    var requestMin = requestTime.toString().slice(requestTime.toString().length/2);

    requestMin = parseInt(requestMin);
    requestHour = parseInt(requestHour);
    //Time to subtract from the requestTime
    var additionalTime = travelTime + tripBuffer;
    //Need to get hours and minutes
    var travelHours = Math.floor((additionalTime)/60);
    var travelMinutes = Math.floor(additionalTime - (travelHours * 60));
    //Subtract the mins
    if(requestMin - travelMinutes < 0){
        requestHour--;
       requestMin = 60 + requestMin - travelMinutes;
    }
    else {
        requestMin -= travelMinutes;
    }
    //Add the hours
    if(requestHour - travelHours > 0){
        requestHour -= travelHours;
    }
    else {
        requestHour += 24;
        requestHour -= travelHours;

    }
    if(requestMin<10){
        requestMin = requestMin.toString();
        requestMin = "0" + requestMin;
    }
    else {
        requestMin = requestMin.toString()
    }
    //Final time
    return requestHour.toString() + requestMin;

}


//Takes a JSON trip object
//Returns the latest dropoff time allowed, if anchor == 'P'
//otherwise returns the latest pickup time allowed
function imputeTimeCalc(tripJSON, zipPath) {
    var pickDrop = tripJSON['anchor'][0];
    var requestTime = tripJSON['requestTime'];
    var pickupZip = tripJSON['pickZip'].substr(1);
    var dropoffZip = tripJSON['dropZip'].substr(1);

    var pickupLocation = zipcodeToCoords(zipPath, pickupZip);
    var pickupArray = [pickupLocation['latitude'], pickupLocation['longitude']];
    var dropStuff =  zipcodeToCoords(zipPath, dropoffZip);
    var finalArray = [pickupArray[0], pickupArray[1], dropStuff['latitude'], dropStuff['longitude']];
    var distanceInMeters = latLongDist(parseFloat(finalArray[0]),parseFloat(finalArray[1]),parseFloat(finalArray[2]),
            parseFloat(finalArray[3]));
    var travelTime = travelTimeCalc(distanceInMeters, 50);
    if(pickDrop == 'P'){
        return estimateDropoffFromPickup(requestTime, travelTime);
        }
    else {
        return estimatePickupFromDropoff(requestTime, travelTime);
        }
}

module.exports = imputeTimeCalc;