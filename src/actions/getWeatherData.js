import request from 'superagent';
import Promise from 'bluebird';
import moment from 'moment-timezone';
import _ from 'lodash';
import {
  updateUserData,
  updateStateVar
} from './staticActionCreators';

//the val will be determined by the webpack define plugin
let env = process.env.NODE_ENV;
let forecastEndpoint = env === 'production' ? '/get-forecast' : 'http://localhost:4000/get-forecast';
let coordinatesEndpoint = env === 'production' ? '/get-coordinates' : 'http://localhost:4000/get-coordinates';

export default function getWeatherData(placeName) {

  return function(dispatch, getState) {

    if (!placeName) {
      //just use whatever's in the store
      if (getState().self.location) {
        let loc = {
          latitude: getState().self.location.latitude,
          longitude: getState().self.location.longitude,
          timezone: getState().self.location.timezone
        }
        fetchWeather(loc);
      } else {
        //need to tell app that we dont have weather
        dispatch(updateUserData({
          weather: false
        }));
        cachedDispatch(updateStateVar({
          auth: 'stub'
        }));
      }

    } else {
      fetchCoordsThenWeather(placeName);
    }

    function fetchWeather(loc) {

      let today = moment().hour(0).minute(0).second(0);
      let tomorrow = today.clone().add(1, 'day');

      request.get(forecastEndpoint)
        .query({
          lat: loc.latitude,
          lon: loc.longitude,
          time: today.format(),
          tomorrowTime : tomorrow.format()
        })
        .then(function(resp) {

          let weather = JSON.parse(resp.text);
          
          //calculate weekly vals
          let apparentTemperatureMax = _.max(_.pluck(weather.thisWeek.daily.data, "apparentTemperatureMax"));
          let apparentTemperatureMin = _.min(_.pluck(weather.thisWeek.daily.data, "apparentTemperatureMin"));

          function convertUnixToTimeZoneMoment(hourlyData){
            return hourlyData.map(function(hr){
              hr.time =  moment.tz(hr.time * 1000, loc.timezone).format();
              return hr
            });
          }

          function convertSunTime(data){
            data.sunriseTime = moment.tz(data.sunriseTime * 1000, loc.timezone).format();
            data.sunsetTime = moment.tz(data.sunsetTime * 1000, loc.timezone).format();
            return data;
          }

          //now arrange into today, tomorrow, this week
          let processedWeather = {
            todayMoment : today,
            today: {
              daily: convertSunTime(weather.today.daily.data[0]),
              hourly: convertUnixToTimeZoneMoment(weather.today.hourly.data)
            },
            tomorrow: {
              daily: convertSunTime(weather.tomorrow.daily.data[0]),
              hourly: convertUnixToTimeZoneMoment(weather.tomorrow.hourly.data)
            },
            'this week': _.extend(weather.thisWeek.daily, {
              apparentTemperatureMin,
              apparentTemperatureMax
            })
          };

          dispatch(updateUserData({
            weather: processedWeather
          }));

        });
    }

    function fetchCoordsThenWeather(placeName) {

      request.get(coordinatesEndpoint)
        .query({
          placeName: placeName
        })
        .then(function(resp) {

          let loc = JSON.parse(resp.text);

          dispatch(updateUserData({
            location: loc
          }));

          fetchWeather({
            longitude: loc.longitude,
            latitude: loc.latitude,
            timezone: loc.timezone
          });
        });
    }
  }
}
