
import getWeatherData from './getWeatherData';
import getCalendarData from './getCalendarData';

export const UPDATE_STATE_VAR = 'UPDATE_STATE_VAR';
export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
export const RESET_STATE = 'RESET_STATE';
export const LOG_OUT = 'LOG_OUT';

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


export const resetState = (obj) => {
  // could be error, tab, auth, menuOpen, or onboardModal
  return {
    type : RESET_STATE
  }
}


export const logOut = (obj) => {
  // could be error, tab, auth, menuOpen, or onboardModal
  return {
    type : LOG_OUT
  }
}
