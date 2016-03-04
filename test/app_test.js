/*eslint-env node, mocha */
/*global expect */
'use strict';

import ReactDOM from 'react-dom';
import React from 'react';

import ReactTestUtils from 'react-addons-test-utils';

import _ from 'lodash';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import StoreCalulator from './../src/store/storeCalculator';
import AppContainer from './../src/components/AppContainer';

import stubData from './../src/store/stub-data';
import {updateStateVar, updateUserData} from './../src/actions/staticActionCreators';

import startApp from './../src/components/startApp';
import configureStore from './../src/store/configureStore';

import * as getCalendarData from './../src/actions/getCalendarData';

describe('Store', () => {

  let store,
    unsubscribe;

  beforeEach(() => {
    store = configureStore();
    store.subscribe(function () {
      StoreCalulator.call(undefined, store);
    });
  });

  afterEach(() => {
    //hack to get a fresh store
    store.dispatch({type: "RESET_STATE"});
  })

  it('should initialize with correct default vals', () => {

    expect(JSON.stringify(_.omit(store.getState(), "stub"))).to.eql(JSON.stringify({
      "onboardModal": true,
      "menuOpen": false,
      "auth": "stub",
      "self": {
        "latLong": undefined
      },
      "tab": "today",
      "error": false,
      "popover": null
    }));

    expect(JSON.stringify(store.getState().stub)).to.eql(JSON.stringify(stubData));

  })

  it('should have a listener that updates certain store state values (e.g. modal, tab hashes) based on other values', () => {

    sinon.spy(store, "dispatch");

    store.dispatch(updateStateVar({auth: 'self', onboardModal: true}));
    expect(store.getState().auth).to.eql('self');

    store.dispatch(updateUserData({calendar: true, weather: true}));

    expect(store.dispatch.args[2][0]).to.eql({
      "type": "UPDATE_STATE_VAR",
      "data": {
        "onboardModal": false
      }
    });

    expect(window.location.hash).to.eql("#/today");

    store.dispatch(updateStateVar({tab: 'this week'}));

    expect(window.location.hash).to.eql("#/this-week");

  });

});

describe('App', () => {

  let store;

  beforeEach(() => {

    let appContainer = document.createElement("div");
    appContainer.id = "app";
    document.body.appendChild(appContainer);

    //make sure singleton store is default state
    store = startApp({test: true});
    store.dispatch({type: "RESET_STATE"});

  });

  function removeApp(){
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

  it("should allow user to view stub data", function (done) {

    expect(store.getState().onboardModal).to.eql(true);
    expect(document.querySelector(".overlay-details").textContent).to.eql(" loading ClimaCal... ");
    expect(store.getState().self.googleAuth).to.be.undefined;

    store.dispatch(updateUserData({googleAuth: false}));

    expect(store.getState().self.googleAuth).to.be.false;
    expect(store.getState().auth).to.eql("stub");

    ReactTestUtils.Simulate.click(document.querySelector("#preview-app-button"));

    expect(store.getState().onboardModal).to.eql(false);
    expect(document.querySelector(".tab-component__tab.active").textContent).to.eql('  today 32°-57°');
    expect(document.querySelector(".all-day-tasks li").textContent).to.eql("remember to send rent check!");

    ReactTestUtils.Simulate.click(document.querySelectorAll(".tab-component__tab a")[1]);

    expect(document.querySelector(".active.tab-component__tab").textContent).to.eql("  tomorrow 18°-37°");
    setTimeout(function () {
      expect(document.querySelector(".all-day-tasks li").textContent).to.eql('Jenny\'s Birthday : make sure to pick up the cake');
      done();
    }, 1000);

  });

  it("should allow google authorization initiated by user from onboard modal", function () {

    store.dispatch(updateUserData({googleAuth: false}));

    sinon.stub(getCalendarData, "googleAuthorize", function () {
      return {type: "fake"}
    });

    expect(getCalendarData.googleAuthorize.callCount).to.eql(0);

    ReactTestUtils.Simulate.click(document.querySelector(".overlay-details button:first-of-type"));

    expect(getCalendarData.googleAuthorize.callCount).to.eql(1);

    getCalendarData.googleAuthorize.restore();

  });

  it("should allow google authorization initiated by user from sidebar", function () {

    store.dispatch(updateStateVar({onboardModal: false, menuOpen: true}));

    sinon.stub(getCalendarData, "googleAuthorize", function () {
      return {type: "fake"}
    });

    expect(getCalendarData.googleAuthorize.callCount).to.eql(0);

    ReactTestUtils.Simulate.click(document.querySelector(".load-google"));

    expect(getCalendarData.googleAuthorize.callCount).to.eql(1);


  });

});
