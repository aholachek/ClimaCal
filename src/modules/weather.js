

import request from 'superagent';
import React from 'react/dist/react-with-addons';
import AppStateManager from './data_store';


function getWeatherData() {

  if (!("geolocation") in navigator) {
    //cant get data
    console.error("can't geolocate")
  }
  navigator.geolocation.getCurrentPosition(function(position) {

    request.get('http://localhost:3000/get-forecast')
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
          AppStateManager.setState(newState);
          return
        }

        let newState = AppStateManager.getState();
        newState.self.latLong = position.coords;
        newState.self.weather = JSON.parse(resp.text);
        AppStateManager.setState(newState);


      });
  });

}

export default {
  getWeatherData: getWeatherData
};
