/**
 * Created by berti on 11/7/2017.
 */
var coordinateObject = null;
var csv = require('csv-parser');
var fs = require('fs');


/*
Asynchronous version of coordinate look up from zip code, not in use.
 */
/*
function zipcodeToCoords(inputCsv, inputZipcode) {
        fs.createReadStream(inputCsv)
            .pipe(csv())
            .on('data', function (data) {
                if(data.zip_code == inputZipcode) {
                    coordinateObject = data;
                    console.log("Found data");
                }
            })
            .on('end', function() {
                if(coordinateObject === null) {
                    console.log("Wasn't able to find matching coordinates for given zipcode " + inputZipcode);
                    throw 'not found';
                } else {
                    console.log("Matching data for " + inputZipcode + ": ");
                    console.log(coordinateObject);
                    return coordinateObject;
                }
            });
}

/*
Synchronous version of coordinate look up from zip code
 */
function syncZip(inputCsv, inputZip) {
    var fileContents = fs.readFileSync(inputCsv);
    var lines = fileContents.toString().split('\n');
    var data = [];
    for (var i = 0; i < lines.length; i++) {
        data.push(lines[i].toString().split(','));
    }
    for (var j = 0; j < lines.length; j++) {
        if (data[j][0] == inputZip) {
            return {latitude: data[j][1], longitude: data[j][2]};
        }
    }
}

module.exports = syncZip;