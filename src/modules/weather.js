

import request from 'superagent';
import React from 'react/dist/react-with-addons';
import AppStateManager from './data_store';


function getWeatherData() {

  if (!("geolocation") in navigator) {
    //cant get data
    console.error("can't geolocate")
  }
  navigator.geolocation.getCurrentPosition(function(position) {

    //for dev this should be 'localhost:3000', not sure how to automate
    request.get('/get-forecast')
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
        try {
          newState.self.weather = JSON.parse(resp.text);
        }
        catch (e){
          console.error("couldn't parse weather json");
          newState.self.weather = false;
        }
        AppStateManager.setState(newState);


      });
  });

}

export default {
  getWeatherData: getWeatherData
};
