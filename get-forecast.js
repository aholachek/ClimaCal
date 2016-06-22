var request = require('request');

//heroku has the weather_key, for development use a local file
var WEATHER_KEY = process.env.WEATHER_KEY ? process.env.WEATHER_KEY : require('./forecast-dev-key');

var WEATHER_URL = "https://api.forecast.io/forecast/";

function getForecast(req, res) {

  //this will duplicate some data but i need the info from the hours before
  //the present one in the current day so it will have to do, and time zone issues
  //require requesting the second day explicitly :[
  var q1 = req.query.lat + ',' + req.query.lon + ',' + req.query.time;
  var q2 = req.query.lat + ',' + req.query.lon;
  var q3 = req.query.lat + ',' + req.query.lon + ',' + req.query.tomorrowTime;

  //get today's 24 hours info
  request({
      uri: WEATHER_URL + WEATHER_KEY + '/' + q1
    },
    function(error1, response1, body1) {
      if (error1) {
        res.status(500).send('unable to retrieve weather information from forecast.io');
      } else {
        //now get todays, tomorrows, this weeks
        request({
            uri: WEATHER_URL + WEATHER_KEY + '/' + q2
          },
          function(error2, response2, body2) {
            if (error2) {
              res.status(500).send('unable to retrieve weather information from forecast.io');
            }

            request({
              uri: WEATHER_URL + WEATHER_KEY + '/' + q3
            }, function(error3, response3, body3) {
              if (error3) {
                res.status(500).send('unable to retrieve weather information from forecast.io');
              } else {
                try {
                  var body1Parsed = JSON.parse(body1);
                  var body2Parsed = JSON.parse(body2);
                  var body3Parsed = JSON.parse(body3);
                  res.status(200).send({
                    today: body1Parsed,
                    tomorrow: body3Parsed,
                    thisWeek: body2Parsed,
                  });
                } catch (e) {
                  res.status(500).send('unable to parse json from forecast.io endpoint (we probably caused an error)');
                }
              }
            });

          });
      }

    });

}

module.exports = getForecast;
