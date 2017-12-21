var app = require('./express');
var express = app.express;
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
var cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

require("./server/app");

var port = process.env.PORT || 3000;

app.listen(port);