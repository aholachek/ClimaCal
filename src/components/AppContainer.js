import { connect } from 'react-redux';
import { updateStateVar } from '../actions/staticActionCreators';
import  AppComponent  from './App';
import { googleAuthorize } from './../actions/getCalendarData';


const mapStateToProps = (state) => {
  return {
    data: state
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeState: (data) => {
      dispatch(updateStateVar(data));
    },
    googleAuthorize : () => {
      dispatch(googleAuthorize());
    }
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
