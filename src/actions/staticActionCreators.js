
import getWeatherData from './getWeatherData';
import getCalendarData from './getCalendarData';

export const UPDATE_STATE_VAR = 'UPDATE_STATE_VAR';
export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';


//the basic actions (used by getCalendarData & getWeatherData)

export const updateUserData = (obj) => {
  return {
    type : UPDATE_USER_DATA,
    data : obj
  }
}

export const updateStateVar = (obj) => {
  // could be error, tab, auth, menuOpen, or onboardModal
  return {
    type : UPDATE_STATE_VAR,
    data : obj
  }
}
