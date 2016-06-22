
import initialState from './../store/default-state';

import {
  UPDATE_STATE_VAR,
  UPDATE_USER_DATA,
  RESET_STATE,
  LOG_OUT
} from './../actions/staticActionCreators';


export default function reducer ( state, action ){

   switch ( action.type ) {

     case UPDATE_USER_DATA:
       return Object.assign({}, state,
          { self : Object.assign(state.self, action.data) }
        );

     case UPDATE_STATE_VAR:
       return Object.assign({}, state, action.data);

     case RESET_STATE:
        return Object.assign({}, JSON.parse(JSON.stringify(initialState)));

     case LOG_OUT:
       // initial checks should default to false, initial state has them as undefined
       let newState = JSON.parse(JSON.stringify(initialState));
       newState.self.weather = false;
       newState.self.googleAuth = false;
       return newState;

     default:
       return state;

   }
}
