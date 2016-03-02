var express = require('express');
var config = require('./config_vars');
var app = express();
var request = require('request');
var cors = require('cors');
var path = require('path');
var enforce = require('express-sslify');

//heroku adds x-forwarded-proto header
app.use(enforce.HTTPS({ trustProtoHeader: true }))


//tell express to serve static files, including index.html

app.use('/', express.static(path.join(__dirname, 'dist')));


var corsOptions = {
  origin: [config.origin, "localhost:8080"]
};

//return forecast for current day, starting from the morning
app.get('/get-forecast',  cors(corsOptions), function (req, res) {

  var today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);

  var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  var q1 = req.query.lat + ',' + req.query.lon + ',' + parseInt(today.getTime()/1000);
  var q2 = req.query.lat + ',' + req.query.lon + ',' + parseInt(tomorrow.getTime()/1000);

  request({
            uri: config.WEATHER_URL + config.WEATHER_KEY + '/' + q1
          },
    function(error1, response1, body1){
    if (error1){
      res.status(500).send('we\'ve made an error, please try again later');
    }
    else {
      //now get tomorrow's values
       request({
         uri: config.WEATHER_URL + config.WEATHER_KEY + '/' + q2
       }, function(error2, response2, body2){
         if (error2){
           res.status(500).send('we\'ve made an error, please try again later');
         }

         res.send({ today : JSON.parse(body1), tomorrow : JSON.parse(body2) });

       });
    }

});

});
//process.env is from heroku
app.listen(process.env.PORT || config.port);
