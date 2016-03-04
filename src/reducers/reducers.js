
import initialState from './../store/default-state';

import {UPDATE_STATE_VAR, UPDATE_USER_DATA} from './../actions/staticActionCreators';

const RESET_STATE = 'RESET_STATE';

export default function reducer ( state, action ){

   switch ( action.type ) {

     case UPDATE_USER_DATA:
       return Object.assign({}, state,
          { self : Object.assign(state.self, action.data) }
        );

     case UPDATE_STATE_VAR:
       return Object.assign({}, state, action.data);

     case RESET_STATE:
        return Object.assign({}, initialState);

     default:
       return state;

   }
}
