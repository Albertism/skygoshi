var mongoose = require("mongoose");
var tripSchema = require("./trip.schema.server");
var tripModel = mongoose.model("TripModel", tripSchema);

tripModel.createTrip = createTrip;
tripModel.deleteTrip = deleteTrip;
tripModel.getAllTrips = getAllTrips;

module.exports = tripModel;

function getAllTrips() {
    return tripModel.find();
}

function createTrip(trip){
    return tripModel
        .create(trip)
        .then(function (result) {
            return result;
        });
}

function deleteTrip(tripId) {
    return tripModel
        .remove({_id : tripId})
        .then(function (status) {
            return;
        });
}
