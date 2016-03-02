
var express = require('express');
var cors = require('cors');

var getForecast = require('./get-forecast');


var app = express();


app.use(cors());

//return forecast for current day, starting from the morning
app.get('/get-forecast', getForecast);

//process.env is from heroku
app.listen(3000);
