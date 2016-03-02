var express = require('express');
var app = express();
var request = require('request');
var path = require('path');
var enforce = require('express-sslify');

var getForecast = require('./get-forecast');

//heroku adds x-forwarded-proto header
app.use(enforce.HTTPS({ trustProtoHeader: true }))

//tell express to serve static files, including index.html
app.use('/', express.static(path.join(__dirname, 'dist')));

//return forecast for current day, starting from the morning
app.get('/get-forecast',  getForecast);

//process.env is from heroku
app.listen(process.env.PORT);
