

import request from 'superagent';
import React from 'react/dist/react-with-addons';
import AppStateManager from './data_store';

let forecastEndpoint = '/get-forecast';
//for dev this needs to be
// forecastEndpoint = 'http://localhost:4000/get-forecast';

function getWeatherData() {

  if (!("geolocation") in navigator) {
    //cant get data
    console.error("can't geolocate");

    let newState = AppStateManager.getState();
    newState.error = "We couldn't get latitude/longitude for you."
    AppStateManager.setState(newState);
    return
  }

  navigator.geolocation.getCurrentPosition(function(position) {

    request.get(forecastEndpoint)
      .query({
        lat: position.coords.latitude,
        lon: position.coords.longitude
      })
      .end(function(err, resp) {

        if (err) {
          console.error('request to /get-forecast failed : ', err);
          let newState = AppStateManager.getState();
          newState.self.latLong = position.coords;
          newState.self.weather = false;
          newState.error = "We couldn't get weather information for you at the moment."
          AppStateManager.setState(newState);
          return
        }

        let newState = AppStateManager.getState();
        newState.self.latLong = position.coords;
        try {
          newState.self.weather = JSON.parse(resp.text);
        }
        catch (e){
          console.error("couldn't parse weather json", resp.text);
          newState.self.weather = false;
        }
        AppStateManager.setState(newState);


      });
  });

}

export default {
  getWeatherData: getWeatherData
};
