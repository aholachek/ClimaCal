/*eslint-env node, mocha */
/*global expect */
'use strict';

import ReactDOM from 'react-dom';
import React from 'react';
import {
  browserHistory
} from 'react-router';
import ReactTestUtils from 'react-addons-test-utils';

import _ from 'lodash';

import {
  Provider
} from 'react-redux';
import {
  createStore
} from 'redux';
import StoreCalulator from './../src/store/storeCalculator';
import AppContainer from './../src/components/AppContainer';

import stubData from './../src/store/stub-data';
import {
  updateStateVar,
  updateUserData
} from './../src/actions/staticActionCreators';

import startApp from './../src/components/startApp';
import configureStore from './../src/store/configureStore';

import * as getCalendarData from './../src/actions/getCalendarData';

describe('Store', () => {

  let store,
    unsubscribe;

  beforeEach(() => {
    delete localStorage.climaCal;

    store = configureStore();
    store.subscribe(function() {
      StoreCalulator.call(undefined, store);
    });
  });

  afterEach(() => {
    //hack to get a fresh store
    store.dispatch({
      type: "RESET_STATE"
    });
  })

  it('should initialize with correct default vals', () => {

    expect(JSON.stringify(_.omit(store.getState(), "stub"))).to.eql(JSON.stringify({
      "onboardModal": true,
      "auth": "stub",
      "self": {},
      "error": false,
      "popover": null
    }));

    expect(JSON.stringify(store.getState().stub)).to.eql(JSON.stringify(stubData));

  })

  it('should have a listener that updates certain store state values (e.g. modal, tab hashes) based on other values', () => {

    sinon.spy(store, "dispatch");

    store.dispatch(updateStateVar({
      auth: 'self',
      onboardModal: true
    }));
    expect(store.getState().auth).to.eql('self');

    expect(store.getState().onboardModal).to.eql(true);

    //hide the onboard modal when the weather + calendar have been loaded
    store.dispatch(updateUserData({
      calendar: true,
      weather: true
    }));

    expect(store.dispatch.args[2][0]).to.eql({
      "type": "UPDATE_STATE_VAR",
      "data": {
        "onboardModal": false
      }
    });

  });

});

describe('App', () => {

  let store;

  beforeEach(() => {

    let appContainer = document.createElement("div");
    appContainer.id = "app";
    document.body.appendChild(appContainer);

    //make sure singleton store is default state
    store = startApp({
      test: true
    });
    store.dispatch({
      type: "RESET_STATE"
    });

  });

  function removeApp() {
    let app = document.querySelector("#app");
    var overlay = document.querySelector(".overlay");
    if (app)
      document.body.removeChild(app);
    if (overlay)
      overlay.parentNode.removeChild(overlay);
  }

  afterEach(() => {
    removeApp();
  });

  it("should allow user to view stub data if initial auth returns false", function() {

    expect(store.getState().onboardModal).to.eql(true);
    expect(document.querySelector(".overlay-details").textContent).to.eql("loading ClimaCal...");
    expect(store.getState().self.googleAuth).to.be.undefined;

    store.dispatch(updateUserData({
      googleAuth: false
    }));

    expect(store.getState().self.googleAuth).to.be.false;
    expect(store.getState().auth).to.eql("stub");

    ReactTestUtils.Simulate.click(document.querySelector("#preview-app-button"));

    //hack, this should happen automatically in the app
    browserHistory.push('/today');

    expect(store.getState().onboardModal).to.eql(false);
    expect(document.querySelector(".tab-component__tab.active").textContent).to.eql("  today 32°-57°");
    expect(document.querySelector(".all-day-tasks li").textContent).to.eql("remember to send rent check!");
    expect(document.querySelector('.calendar__entrylist li:first-of-type h5').textContent).to.eql("breakfast meeting");

  });

  it("should allow google authorization initiated by user from onboard modal", function() {

    store.dispatch(updateUserData({
      googleAuth: false
    }));

    var spy = sinon.spy();

    sinon.stub(getCalendarData, "googleAuthorize", function() {
      return spy;
    });

    expect(spy.callCount).to.eql(0);

    ReactTestUtils.Simulate.click(document.querySelector(".overlay-details button:first-of-type"));

    expect(spy.callCount).to.eql(1);
    getCalendarData.googleAuthorize.restore();

  });

  it("should allow google authorization initiated by user from the dropdown", function(done) {

    store.dispatch(updateStateVar({
      onboardModal: false
    }));
    store.dispatch(updateUserData({
      googleAuth: false
    }));

    ReactTestUtils.Simulate.click(document.querySelector(".dd-menu button"));

    setTimeout(function() {
      ReactTestUtils.Simulate.click(document.querySelector(".load-google"));
      expect(document.querySelector(".overlay__header").textContent).to.eql("ClimaCal connects your calendar with an hourly weather report.");
      done();
    }, 800)

  });

});

describe("localStorage interaction", (done) => {

  it("should load a place from localStorage if possible", function() {

    let appContainer = document.createElement("div");
    appContainer.id = "app";
    document.body.appendChild(appContainer);

    localStorage.climaCal = JSON.stringify({
      self: {
        location: 'Figi'
      }
    });

    //make sure singleton store is default state
    var store = startApp({
      test: true
    });

    expect(store.getState().self.location).to.eql("Figi");

    setTimeout(function(){
      document.querySelector("#app").remove();
      [].slice.apply(document.querySelectorAll(".overlay")).forEach(function(el){
        el.remove();
      });
      done();
    }, 1500);

  });

});
