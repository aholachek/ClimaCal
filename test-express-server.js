var express = require('express');
var cors = require('cors');

var getForecast = require('./get-forecast');
var getCoordinates = require('./get-coordinates');

var app = express();

app.use(cors());

//return forecast for current day, starting from the morning
app.get('/get-forecast', getForecast);

app.get('/get-coordinates', getCoordinates);



//process.env is from heroku
app.listen( 4000 );
