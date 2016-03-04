
import 'core-js/fn/object/assign';

import ReactDOM from 'react-dom';
import React from 'react';

import { calendarInit } from './../actions/getCalendarData';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import configureStore from './../store/configureStore';
import StoreCalulator from './../store/storeCalculator';
import AppContainer from './AppContainer';
import { updateStateVar } from './../actions/staticActionCreators';

export default function startApp(options){

  const store = configureStore();

  store.subscribe(function(){ StoreCalulator.call(undefined, store); });

  //attaches a script tag to head, contacts google API
  if (!options || !options.test){
    store.dispatch(calendarInit());
  }

  //set the hash url into the state, if there is one
  // will be either '#/this-week', '#/today', '#/tomorrow'
  if (location.hash){
    let tab = location.hash.replace(/^#\//, "").replace(/-/g, " ");
    store.dispatch(updateStateVar({tab: tab }));
  }

  ReactDOM.render(
    <Provider store={store}>
      <AppContainer/>
    </Provider>,
    document.getElementById('app')
  );

  return store;

}
