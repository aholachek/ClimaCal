import React from 'react/dist/react-with-addons';
import moment from 'moment';
import {
  updateUserData,
  updateStateVar
} from './staticActionCreators';

import getWeatherData from './getWeatherData';


//google auth

var CLIENT_ID = '410834287787-sirh0hvkvs3if125evkhl958km2pvhmv.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

var cachedDispatch; //hack ?? to get access to dispatch function in other funcs

//must be global
window.checkAuth = function() {
  gapi.auth.authorize({
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true
  }, handleAuthResult);
};

//once authorized by google, fetch calendar + fetch weather
function onAuth (){
  cachedDispatch(updateStateVar( {auth : 'self' }));
  loadCalendarApi();
  cachedDispatch(getWeatherData);
}

//initial check of auth status
function handleAuthResult(authResult) {
  let auth = (authResult && !authResult.error) ? true : false;
  cachedDispatch(updateUserData({ googleAuth : auth }));

  if (auth) {
    onAuth();
  }
  else {
    cachedDispatch(updateStateVar( {auth : 'stub' }));
  }
}

function handleUserInitiatedAuthResult(authResult) {

  let auth = (authResult && !authResult.error) ? true : false;
  cachedDispatch(updateUserData({googleAuth : auth}));

  if (auth) {
    onAuth();
  } else {
    cachedDispatch(updateStateVar({
      error : 'We couldn\'t authenticate with Google.',
      onboardModal : true,
      menuOpen : false

     }));
  }
}


function loadCalendarApi() {
  gapi.client.load('calendar', 'v3', listUpcomingEvents);
}

function listUpcomingEvents() {

  var today = moment();
  today.hour(0).minute(0).second(0);

  var oneWeekFromNow = today.clone().add(7, 'day');

  var request = gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': today.format(),
    'timeMax': oneWeekFromNow.format(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 200,
    'orderBy': 'startTime'
  });

  request.execute(function(resp) {

    if (resp.code && resp.code !== 200) {
      console.error('couldn\'t contact google api', resp);
    }
    cachedDispatch(updateUserData({ calendar : resp.items }));

  });
}


export function calendarInit() {
  return function(dispatch) {
    cachedDispatch = dispatch;

    var s = document.createElement('script');
    s.src = 'https://apis.google.com/js/client.js?onload=checkAuth';
    document.querySelector('head').appendChild(s);
  };
}

export function googleAuthorize () {

  return function(dispatch){

      gapi.auth.authorize({
          client_id: CLIENT_ID,
          scope: SCOPES,
          immediate: false
        },
        handleUserInitiatedAuthResult);
      return false;
  }

}
