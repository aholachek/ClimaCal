
import 'core-js/fn/object/assign';

import ReactDOM from 'react-dom';
import React from 'react';
import { Router, Route, browserHistory, Redirect } from 'react-router';

import { calendarInit } from './../actions/getCalendarData';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import configureStore from './../store/configureStore';
import StoreCalculator from './../store/storeCalculator';
import AppContainer from './AppContainer';
import { updateStateVar } from './../actions/staticActionCreators';

export default function startApp(options){
  options = options || {};

  const store = configureStore();
  store.subscribe(function(){ StoreCalculator.call(undefined, store); });
  store.dispatch(calendarInit());

  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        <Redirect from="/" to="today" />
        <Route path="*" component={AppContainer}></Route>
      </Router>
    </Provider>,
    document.getElementById('app')
  );

  return store;

}
