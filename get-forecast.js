
var request = require('request');
var config = require('./config_vars');

function getForecast (req, res) {

  var q1 = req.query.lat + ',' + req.query.lon + ',' + req.query.todayUNIX;
  var q2 = req.query.lat + ',' + req.query.lon + ',' + req.query.tomorrowUNIX;

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
