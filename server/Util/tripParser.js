/**
 * Created by berti on 11/7/2017.
 */
var inputArray = [];
var csv = require('csv-parser');
var fs = require('fs');

function tripParser(inputCsv, entryDateString) {
    return new Promise(function(resolve, reject) {
        var readStream = fs.createReadStream(inputCsv);
        readStream
            .pipe(csv())
            .on('data', function (data) {
                var jsonObject = {
                    _id: data.TripID,
                    entryDate: new Date(entryDateString),
                    subscription: data.Subscription === 'Y',
                    ada: data.ada === "ADA",
                    anchor: data.Anchor,
                    requestTime: timeStringToNumber(data.RequestTime),
                    pca: data.PCAs,
                    companions: data.Companions,
                    serviceAnimal: data.ServiceAnimal === 'Y',
                    pickHouseNumber: data.PickHouseNumber,
                    pickAddress1: data.PickAddress1,
                    pickCity: data.Pickcity,
                    pickZip: "0" + data.pickzip,
                    dropHouseNumber: data.DropHouseNumber,
                    dropAddress1: data.DropAddress1,
                    dropCity: data.Dropcity,
                    dropZip: "0" + data.DropZip
                };
                //push it to array
                inputArray.push(jsonObject);
            })
            .on('end', function() {
                console.log("Finished processing csv file to json array...");
                resolve(inputArray);
                readStream.unpipe();
                readStream.destroy();
            });
    });
}

function timeStringToNumber(inputString) {
    if(!inputString.includes(":") || !inputString.includes(" ")) {
        throw new Error("Invalid input time in the csv file: " + inputString);
    }

    var str1 = inputString.split(" ");
    var time = str1[0].split(":");
    var hr = parseInt(time[0]);
    var min = time[1];
    var des = str1[1];

    if(des !== "AM" && des !== "PM") {
        throw new Error("Invalid input time in the csv file: " + inputString);
    }

    if(des === "PM") {
        hr += 12;
    }

    var timeString = ""+ hr + min;

    return parseInt(timeString);
}

module.exports = tripParser;