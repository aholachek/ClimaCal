import React from 'react/dist/react-with-addons';
import moment from 'moment';
import {
  updateUserData,
  updateStateVar
} from './staticActionCreators';

import getWeatherData from './getWeatherData';

//google auth

var CLIENT_ID = '410834287787-sirh0hvkvs3if125evkhl958km2pvhmv.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly', 'email'];

var cachedDispatch; //hack ?? to get access to dispatch function in other funcs

//must be global
window.checkAuth = function() {
  gapi.auth.authorize({
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true,
    'cookie_policy': 'single_host_origin'
  }, handleAutoAuthResult);
};

//once authorized by google, fetch email name --> fetch calendar --> fetch weather
//called by both autoauth and user inititatedauth
function onAuth (){

  gapi.client.load('oauth2', 'v2', function()
  {
    gapi.client.oauth2.userinfo.get()
      .execute(function(resp)
      {
        var email = resp.email || 'logged in with Google';
        cachedDispatch(updateStateVar({auth : 'self'}));
        cachedDispatch(updateUserData({googleAuth : email }));

        loadCalendarApi();
      });
  });
}

//initial check of auth status
function handleAutoAuthResult(authResult) {
  let auth = (authResult && !authResult.error) ? true : false;

  if (auth) {
    onAuth();
    cachedDispatch(getWeatherData());
  }
  else {
    //show modal
    cachedDispatch(updateUserData({googleAuth : false }));
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

  var request = gapi.client.calendar.calendarList.list();

  request.execute(function(calendarData){
    let calendarIds = calendarData.items.map(function(item){ return item.id }).slice(0,5);
    let allItems = [];
    let requestCount = calendarIds.length;
    calendarIds.forEach(function(id){

      var request = gapi.client.calendar.events.list({
        'calendarId': id,
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
        [].push.apply(allItems, resp.items);
        requestCount-=1;
        if (requestCount == 0){
          cachedDispatch(updateUserData({ calendar : allItems }));
        }
      });

    });

  });

}

export function calendarInit() {
  return function(dispatch, getState) {
    cachedDispatch = dispatch;

    var s = document.createElement('script');
    s.src = 'https://apis.google.com/js/client.js?onload=checkAuth';
    document.querySelector('head').appendChild(s);
  };
}

export function googleAuthorize () {

  return function(dispatch){

      gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': false,
        'cookie_policy': 'single_host_origin'
        },
        handleUserInitiatedAuthResult);
      return false;
  }

}
