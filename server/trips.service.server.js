/**
 * Created by berti on 8/1/2017.
 */
var app = require("../express");
var tripModel = require("./models/trip.model.server");
var tripParser = require("./Util/tripParser");
var tripAlgorithm = require("./Util/algorithm");

app.get("/api/test/trips", getAllTrips);
app.post("/api/test/trips", createTrip);
app.post("/api/upload/trips", importTrip);
app.delete("/api/test/trips/:entityId", deleteTrip);
app.get("/api/parse/trips", parseCSV);
app.post("/api/parse/tripAlgorithm", runTripAlgorithm);

function runTripAlgorithm(req, res) {
    var sliceTime = req.query.slice_time;
    var clusterTime = req.query.cluster_time;
    var bearingDiff = req.query.bearing_diff;
    var inputData = req.body;

    console.log("data: ");
    console.log(inputData.length);

    var finalArray = tripAlgorithm(inputData, sliceTime, clusterTime, bearingDiff);

    console.log("run successfully. ");

    // console.log(finalArray);

    res.json(finalArray);

}

function importTrip(req, res) {
    var csvPath = req.params.csv_path;
    var entryDate = req.params.entry_date;

    tripParser(csvPath, entryDate).then(function(jsonArray) {
        for(var i =0; i < jsonArray.length; i++) {
            console.log("Inserting trip " + jsonArray[i]._id);
            tripModel.createTrip(jsonArray[i])
                .then(function(response) {
                    console.log("Successfully created trip");
                }, function(err) {
                    res.sendStatus(500).send(err);
                });
        }
    });
}

function parseCSV(req, res) {
    var csvPath = req.query.csv_path;
    var entryDate = req.query.entry_date;

    console.log(entryDate);

    tripParser(csvPath, entryDate).then(function(jsonArray) {
        res.json(jsonArray);
        res.end();
    });
}

function getAllTrips(req, res) {
    tripModel
        .getAllTrips()
        .then(function (response) {
            res.json(response);
            return;
        }, function (err) {
            res.sendStatus(500).send(err);
            return;
        });
}

function createTrip(req, res) {
    var trip = req.body;
    var tripId = req.params.tripId;

    tripModel
        .createEntity(trip, tripId)
        .then(function (doc) {
            res.json(doc);
            return;
        }, function (err) {
            res.send(err.message);
            return;
        });
}

function deleteTrip(req, res) {
    var tripId = req.params.tripId;

    tripModel
        .deleteTrip(tripId)
        .then(function (status) {
            res.sendStatus(200);
            return;
        }, function (err) {
            res.sendStatus(500).send(err.message);
            return;
        });
}

var multer = require('multer');
// var upload = multer({ dest: 'public/upload/'});
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload/')
    },
    filename: function (req, file, cb) {
        var fileName = file.originalname;
        cb(null, fileName);
    }
});

var upload = multer({ storage: storage });
app.post ("/api/upload/csv", upload.single('myFile'), uploadCsv);

function uploadCsv(req, res) {

    var myFile = req.file;

    console.log("file successfully received");
    console.log(myFile);

    var originalname  = myFile.originalname; // file name on user's computer
    var filename      = myFile.filename;     // new file name in upload folder
    var path          = myFile.path;         // full path of uploaded file
    var destination   = myFile.destination;  // folder where file is saved to
    var size          = myFile.size;
    var mimetype      = myFile.mimetype;

    var callbackUrl   = "../../../#!";

    res.send(req.file);
}

