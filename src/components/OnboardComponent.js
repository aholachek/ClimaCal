'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Portal from 'react-portal';
import Isvg from 'react-inlinesvg';

import AppStateManager from './../modules/data_store';

import Calendar from './../modules/calendar';
import Weather from './../modules/weather';


class OnboardComponent extends React.Component {


  constructor(props) {
    super(props);

    this._previewClick = this._previewClick.bind(this);
    this._beforeClose = this._beforeClose.bind(this);

  }

  _authorize (){
    let newState = AppStateManager.getState();
    newState.auth = 'self';
    AppStateManager.setState(newState);
    //when authorized, weather will be requested
    Calendar.handleAuthClick();
  }

  _beforeClose (node, removeFromDom) {
    node.querySelector(".overlay").classList.add("fade-out-up");
    setTimeout(function(){
      removeFromDom();
    }, 500);

  }

  _previewClick () {
    let newState = AppStateManager.getState();
    newState.onboardModal = false;
    //if there's an error, the person has seen the message, now delete it
    if (this.props.appData.error ){
      newState.error = false;
    }
    AppStateManager.setState(newState);
  }

  render() {
    let container;

    let errorMessage = this.props.appData.error;
    if (errorMessage){
      errorMessage = (
        <div>
          <p> <i className="fa fa-warning"></i> { this.props.appData.error } </p>
          <p> Sorry! Try just checking out the app preview for now. </p>
        </div>
      )
    }
    else {
      errorMessage = (<div></div>);
    }

    if (
      //if undefined, hasn't returned. if false, it's not available (might have been an error)
      this.props.appData.auth === "self" && (
        (this.props.appData.self.weather === undefined) || (this.props.appData.self.calendar === undefined)
      )||
      //if equal to undefined, initial loading check is in progress
      this.props.appData.self.googleAuth === undefined
        ){
      container = (<div className="overlay-details" style={{paddingTop: '80px'}}> loading <b>ClimaCal...</b> </div>)
    }
    else {
      container = (
      <div className="overlay-details">
        <h1 className="sr-only">
            ClimaCal
        </h1>

        {errorMessage}

        <button onClick={this._authorize} style={{marginBottom: '20px'}}> load my calendar + local weather data </button>
        <div>&nbsp;&nbsp;or&nbsp;&nbsp;</div>
        <button id="preview-app-button" onClick={this._previewClick} style={{marginTop: '20px'}}>view a preview of the app</button>

      </div>
      );
    }

    let className = "overlay";
    if (this.props.appData.self.googleAuth === false) className += " fade-background";

    return (
      <Portal
        isOpened={this.props.appData.onboardModal}
        beforeClose = {this._beforeClose}
      >
          <div className={className}>
              <div className="overlay-content">
                <img src="/images/climacal.png"/>
              {container}
              </div>
        </div>
      </Portal>
    )
  }


}

OnboardComponent.displayName = 'OnboardComponent';

OnboardComponent.propTypes = {
  appData : React.PropTypes.object.isRequired,
};
// OnboardComponent.defaultProps = {};

export default OnboardComponent;
