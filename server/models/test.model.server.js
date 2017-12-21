var mongoose = require("mongoose");
var testSchema = require("./test.schema.server");
var testModel = mongoose.model("TestModel", testSchema);

testModel.createEntity = createEntity;
testModel.deleteEntity = deleteEntity;
testModel.getEntities = getEntities;

module.exports = testModel;

function getEntities() {
    return testModel.find();
}

function createEntity(entity){
    return testModel
        .create(entity)
        .then(function (result) {
            return result;
        });
}

function deleteEntity(entityId) {
    return testModel
        .remove({_id : entityId})
        .then(function (status) {
            return;
        });
}
