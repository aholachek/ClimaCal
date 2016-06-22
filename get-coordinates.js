var NodeGeocoder = require('node-geocoder');
var tzwhere = require('tzwhere');

tzwhere.init();

//heroku has the keys, for development use a local file
var KEY = process.env.GEOCODE_KEY ? process.env.GEOCODE_KEY : require('./geocode-key');

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

getCoordinates = function(req, res) {

geocoder.geocode(req.query.placeName)
  .then(function(geoResponse) {

    geoResponse = geoResponse[0];
    geoResponse.timezone = tzwhere.tzNameAt(geoResponse.latitude, geoResponse.longitude);
    res.status(200).send(geoResponse);

  }).catch(function(err) {
  res.status(500).send('Google geocoding didn\'t work');
  });

}

module.exports = getCoordinates;
