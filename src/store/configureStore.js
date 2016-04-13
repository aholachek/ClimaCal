
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducer from './../reducers/reducers';
import initialState from './default-state';
import { routerReducer } from 'react-router-redux'


const loggerMiddleware = createLogger();

export default function configureStore () {
  return createStore(
    reducer,
    JSON.parse(JSON.stringify(initialState)),
    applyMiddleware(
      thunkMiddleware
  )
);
}
