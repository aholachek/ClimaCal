import {  logOut } from './../actions/staticActionCreators';


export default function () {
  return function (dispatch, store) {
    gapi.auth.signOut();
    localStorage.climaCal = "";
    dispatch(logOut());
  }
}
