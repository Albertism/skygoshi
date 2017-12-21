/**
 * Created by ani on 8/08/17.
 */
var mongoose = require('mongoose');
var tripSchema = mongoose
    .Schema(
        {
            _id: {type: Number, required: true, unique: true},
            entryDate: {type: Date, required: true},
            subscription: {type: Boolean, required: true, default: false},
            ada: {type: Boolean, required: true, default: true},
            anchor: {type: String, enum: ['P', 'A'], required: true},
            requestTime: {type: Number, required: true},
            pca: Number,
            companions: Number,
            serviceAnimal: Boolean,
            pickHouseNumber: {type: String, required: true},
            pickAddress1: {type: String, required: true, uppercase: true},
            pickCity: {type: String, required: true, uppercase: true},
            pickZip: {type: String, required: true},
            dropHouseNumber: {type: String, required: true},
            dropAddress1: {type: String, required: true},
            dropCity: {type: String, required: true, uppercase: true},
            dropZip: {type: String, required: true}
        }, {collection : "trips", _id: false});

module.exports = tripSchema;