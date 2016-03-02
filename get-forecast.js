
var request = require('request');
var config = require('./config_vars');

function getForecast (req, res) {

  var today = new Date();
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);

  var tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  //wants the ISO String, will change to correct time zone given lat + long
  var q1 = req.query.lat + ',' + req.query.lon + ',' + today.toISOString().split(".")[0];
  var q2 = req.query.lat + ',' + req.query.lon + ',' + tomorrow.toISOString().split(".")[0];

  request({
            uri: config.WEATHER_URL + config.WEATHER_KEY + '/' + q1
          },
    function(error1, response1, body1){
    if (error1){
      res.status(500).send('unable to retrieve weather information from forecast.io');
    }
    else {
      //now get tomorrow's values
       request({
         uri: config.WEATHER_URL + config.WEATHER_KEY + '/' + q2
       },
       function(error2, response2, body2) {
         if (error2){
           res.status(500).send('unable to retrieve weather information from forecast.io');
         }

         try {
           var body1Parsed = JSON.parse(body1);
           var body2Parsed = JSON.parse(body2);
           res.status(200).send({ today : body1Parsed, tomorrow : body2Parsed });
         }
         catch(e){
           res.status(500).send('unable to parse json from forecast.io endpoint (we probably caused an error)');
         }


       });
    }

});

}

module.exports = getForecast;
