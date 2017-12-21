/**
 * Created by berti on 8/1/2017.
 */
var app = require("../express");
var testModel = require("./models/test.model.server");

app.get("/api/test", getEntities);
app.post("/api/test", createEntity);
app.delete("/api/test/:entityId", deleteEntity);

function getEntities(req, res) {
    testModel
        .getEntities()
        .then(function (response) {
            res.json(response);
            return;
        }, function (err) {
            res.sendStatus(500).send(err);
            return;
        });
}

function createEntity(req, res) {
    var entity = req.body;
    var entityId = req.params.entityId;

    testModel
        .createEntity(entity, entityId)
        .then(function (doc) {
            res.json(doc);
            return;
        }, function (err) {
            res.send(err.message);
            return;
        });
}


function deleteEntity(req, res) {
    var entityId = req.params.entityId;

    testModel
        .deleteEntity(entityId)
        .then(function (status) {
            res.sendStatus(200);
            return;
        }, function (err) {
            res.sendStatus(500).send(err.message);
            return;
        });
}
