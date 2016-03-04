import request from 'superagent';
import moment from 'moment';
import React from 'react/dist/react-with-addons';
import {
  updateUserData,
  updateStateVar
} from './staticActionCreators';

let forecastEndpoint = '/get-forecast';
//for dev this needs to be uncommented
 // forecastEndpoint = 'http://localhost:4000/get-forecast';

export default function getWeatherData( dispatch ) {

  if ( !( "geolocation" in navigator ) ) {
    //cant get data
    console.error( "can't geolocate" );
    dispatch( updateStateVar( {
      error: 'We couldn\'t get latitude/longitude for you.'
    } ) );
    return;
  }

  let today = moment()
    .hour( 0 )
    .minute( 0 )
    .second( 0 );

  navigator.geolocation.getCurrentPosition(
    function ( position ) {

      request.get( forecastEndpoint )
        .query( {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          todayUNIX: today.unix()
        } )
        .end( function ( err, resp ) {

          if ( err ) {
            console.error(
              'request to /get-forecast failed : ',
              err );

            dispatch( updateUserData( {
              latLong: position.coords,
              weather: false
            } ) );

            dispatch( updateStateVar( {
              error: 'We couldn\'t get weather data for you',
              auth: 'stub',
              onboardModal : true,
              menuOpen : false

            } ) );
            return;
          }

          let weather;

          try {

            weather = JSON.parse( resp.text );

          } catch ( e ) {

            console.error( "couldn't parse weather json",  resp.text );

            dispatch( updateStateVar( {
              weather: false,
              latLong: position.coords
            } ) );
            dispatch( updateStateVar( {
              error: 'We can\'t load weather data right now.',
              auth: 'stub',
              onboardModal : true,
              menuOpen : false

            } ) );
            return;

          }

          let tomorrow = today.clone()
            .add( 1, 'day' );

          //unix time in seconds
          let start = tomorrow.unix(),
            end = tomorrow.clone()
            .add( 1, 'day' )
            .unix();

          let tomorrowHours = weather.thisWeek
            .hourly.data.filter( function ( h ) {
              //you receive unix time in seconds
              if ( h.time >= start && h.time <
                end ) return true;
            } );

          //calculate weekly vals
          let apparentTemperatureMax = _.max(_.pluck(weather.thisWeek.daily.data, "apparentTemperatureMax"));
          let apparentTemperatureMin = _.min(_.pluck(weather.thisWeek.daily.data, "apparentTemperatureMin"));

          //now arrange into today, tomorrow, this week
          let processedWeather = {
            today: {
              daily: weather.today.daily.data[ 0 ],
              hourly: weather.today.hourly.data
            },
            tomorrow: {
              daily: weather.thisWeek.daily.data[ 1 ],
              hourly: tomorrowHours
            },
            'this week': _.extend(weather.thisWeek.daily, {
              apparentTemperatureMin,
              apparentTemperatureMax
            })
          };

          dispatch( updateUserData( {
            weather: processedWeather,
            latLong: position.coords
          } ) );

        } );
    } );

}
