
var request = require('request');
var config = require('./config_vars');
var moment = require('moment');

function getForecast (req, res) {

//use moment since browsers' implementation of date object is inconsistent!!!!
  var today = moment().hour(0).minute(0).second(0);

  var tomorrow = moment(today).add(1, 'day');

  //wants the UNIX seconds since 1970
  var q1 = req.query.lat + ',' + req.query.lon + ',' + today.unix();
  var q2 = req.query.lat + ',' + req.query.lon + ',' + tomorrow.unix();

console.log("request uri for today: " + config.WEATHER_URL + config.WEATHER_KEY + '/' + q1);

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
           res.status(200).send({
              today : body1Parsed,
              tomorrow : body2Parsed,
              forecasturls : {
                today : config.WEATHER_URL + "[key]" + '/' + q1,
                tomorrow : config.WEATHER_URL + "[key]" + '/' + q2,
              } });
         }
         catch(e){
           res.status(500).send('unable to parse json from forecast.io endpoint (we probably caused an error)');
         }


       });
    }

});

}

module.exports = getForecast;
