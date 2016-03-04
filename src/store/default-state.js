
import StubData from './stub-data';

// this object is the master state for the  app
// modules like weather and calendar can access it

let appState = {

    onboardModal : true,

    menuOpen : false,

    auth : 'stub',

    stub : {
        calendar: StubData.calendar,
        weather: StubData.weather
      },

    self : {
        calendar: undefined,
        weather: undefined,
        //will be changed to "false" by initial check
        //if there is no access
        googleAuth : undefined,
        latLong : undefined,
      },

    tab : 'today',

    //represents an error getting user data
    error : false,

    popover : null

  };


export default appState;
