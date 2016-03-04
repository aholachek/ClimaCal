
import {
  updateUserData,
  updateStateVar
} from './../actions/staticActionCreators';

import  getWeatherData   from  './../actions/getWeatherData';
import { googleAuthorize } from './../actions/getCalendarData';

//listens to state and dispatches actions or adjusts state vars

export default function(store){

  var state = store.getState();

  if ( state.auth === 'self' &&  state.self.calendar &&  state.self.weather && state.onboardModal ){
    //if first two are true but no calendar data yet, will show loading view
    store.dispatch(updateStateVar({ onboardModal : false}));
  }

//keep hash urls in sync
  if (!state.onboardModal){
    window.location.hash = "/" + state.tab.replace(/\s/g, "-");
  }

}
