import { connect } from 'react-redux';
import { updateStateVar } from '../actions/staticActionCreators';
import  AppComponent  from './App';
import { googleAuthorize } from './../actions/getCalendarData';
import getWeatherData from './../actions/getWeatherData';
import logOut from './../actions/logOut';

const mapStateToProps = (state) => {
  return {
    data: state
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getWeatherData : (placeName)=> {
      dispatch(getWeatherData(placeName));
    },
     showLoginPage : ()=> {
       dispatch(updateStateVar({ onboardModal : true }));
    },
    changeState: (data) => {
      dispatch(updateStateVar(data));
    },
    googleAuthorize : () => {
      dispatch(googleAuthorize());
    },
    logOut : () => {
      dispatch(logOut())
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
