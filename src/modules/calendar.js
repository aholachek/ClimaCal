
import React from 'react/dist/react-with-addons';
import moment from 'moment';
import AppStateManager from './data_store';


//google auth
//this code largely copied from Google JS Calendar instructions

  var CLIENT_ID = '410834287787-sirh0hvkvs3if125evkhl958km2pvhmv.apps.googleusercontent.com';
  var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

  //must be global
  window.checkAuth = function() {
    gapi.auth.authorize({
      'client_id': CLIENT_ID,
       'scope': SCOPES.join(' '),
        'immediate': true
    }, handleAuthResult);
  }

  function init() {
    var s = document.createElement('script');
    s.src = 'https://apis.google.com/js/client.js?onload=checkAuth';
    document.querySelector('head').appendChild(s);
  }

  /**
               * Handle response from authorization server.
               *
               * @param {Object} authResult Authorization result.
               */
  function handleAuthResult(authResult) {

  let auth = (authResult && !authResult.error)  ? true: false;
  let newState = AppStateManager.getState();

  if (auth){
    newState.self.googleAuth = auth;
    newState.auth = 'self';
    AppStateManager.setState(newState);
    loadCalendarApi();
  }
  else {
    //no access
    //set to false so loading view can be removed
    newState.self.googleAuth = auth;
    AppStateManager.setState(newState);
  }

}
/**
             * Handle response from authorization server.,
             * and set an error if the authorization is false.
             *
             * @param {Object} authResult Authorization result.
             */
function handleUserInitiatedAuthResult (authResult){

  let auth = (authResult && !authResult.error)  ? true: false;
  let newState = AppStateManager.getState();

  if (auth){
    newState.self.googleAuth = auth;
    newState.auth = 'self';
    AppStateManager.setState(newState);
    loadCalendarApi();
  }
  else {
    //no access
    //set to false so loading view can be removed
    newState.self.googleAuth = auth;
    newState.error = "We couldn't authenticate with Google."
    AppStateManager.setState(newState);
  }

}

  /**
               * Load Google Calendar client library. List upcoming events
               * once client library is loaded.
               */
  function loadCalendarApi() {
    gapi.client.load('calendar', 'v3', listUpcomingEvents);
  }

  /**
               * Print the summary and start datetime/date of the next 100 events in
               * the authorized user's calendar. If no events are found an
               * appropriate message is printed.
               */
  function listUpcomingEvents() {

    var today = moment();
        today.hour(0).minute(0).second(0);

    var tomorrow = moment(today).add(1, 'day');

    var request = gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': today.format(),
      'timeMax' : tomorrow.format(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 200,
      'orderBy': 'startTime'
    });

    request.execute(function(resp) {
      if (resp.code && resp.code !== 200) {console.error('couldn\'t contact google api', resp);}
      var events = resp.items;

      let newState = AppStateManager.getState();
      newState.self.calendar = events;
      AppStateManager.setState(newState);

    });
  }

  function handleAuthClick() {
    gapi.auth.authorize(
         {
           client_id: CLIENT_ID,
           scope: SCOPES,
           immediate: false
         },
         handleUserInitiatedAuthResult);
    return false;
  }

  let calendarMethods =  {
      init: init,
      handleAuthResult: handleAuthResult,
      loadCalendarApi: loadCalendarApi,
      listUpcomingEvents: listUpcomingEvents,
      handleAuthClick: handleAuthClick
    };

export default calendarMethods;
