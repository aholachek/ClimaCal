
import { createStore, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import _ from 'lodash';
import createLogger from 'redux-logger';
import reducer from './../reducers/reducers';
import initialState from './default-state';
import { routerReducer } from 'react-router-redux'

const saveToLocalStorage = store => next => action => {
  try{
    localStorage.climaCal = JSON.stringify(store.getState());
  }
  catch (e){
    //ignore
  }
  return next(action);
}

const enhancer = compose(
  applyMiddleware(thunkMiddleware, createLogger(), saveToLocalStorage)
);

let initial =  JSON.parse(JSON.stringify(initialState));

if ( localStorage && localStorage.climaCal ) {
  var cachedLocation = JSON.parse(localStorage.climaCal).self.location;
  initial.self.location =  cachedLocation;
}


export default function configureStore () {
  return createStore(
    reducer,
    initial,
    enhancer
);
}
