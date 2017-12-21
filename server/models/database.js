var q = require('q');
var mongoose = require ('mongoose');

var connectionString = 'mongodb://127.0.0.1:27017/test';
// if(process.env.DB_USERNAME && process.env.DB_PASSWORD) { // check if running remotely
//     connectionString = 'mongodb://'+ process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@128.31.24.241/admin';
//     console.log("Connecting to remote database...");
// } else {
//     console.log("Connecting to local database...");
// }

var db = mongoose.connect(connectionString, function(err, db) {
        if (err) {
            console.log('Unable to connect to the server. Please start the server. Error:', err);
        } else {
            console.log('Connected to Server successfully!');
        }
    });

var conn = db.connection;

mongoose.Promise = q.Promise;

module.exports = conn;