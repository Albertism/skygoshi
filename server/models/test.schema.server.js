/**
 * Created by ani on 8/08/17.
 */
var mongoose = require('mongoose');
var testSchema = mongoose
    .Schema(
        {
            name : String
        }, {collection : "testmodel"});

module.exports = testSchema;

