'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Portal from 'react-portal';
import Isvg from 'react-inlinesvg';

import AppStateManager from './../modules/data_store';

import Calendar from './../modules/calendar';
import Weather from './../modules/weather';


class OnboardComponent extends React.Component {

  _authorize (){
    let newState = AppStateManager.getState();
    newState.auth = 'self';
    AppStateManager.setState(newState);
    //when authorized, weather will be requested
    Calendar.handleAuthClick();
  }

  beforeClose(node, removeFromDom) {
    node.querySelector(".overlay").classList.add("fade-out-up");
    setTimeout(function(){
      removeFromDom();
    }, 500);

  }

  render() {
    let container;

    if (
      //if undefined, hasn't returned. if false, it's not available (might have been an error)
      this.props.appData.auth === "self" && (
        (this.props.appData.self.weather === undefined) || (this.props.appData.self.calendar === undefined)
      )||
      //if equal to undefined, initial loading check is in progress
      this.props.appData.self.googleAuth === undefined
        ){
      container = (<div className="overlay-details" style={{paddingTop: '80px'}}> Loading </div>)
    }
    else {
      container = (
      <div className="overlay-details">
        <h1 className="sr-only">
            ClimaCal
        </h1>

        <button onClick={this._authorize} style={{marginBottom: '20px'}}> load my calendar + local weather data </button>
        <div>&nbsp;&nbsp;or&nbsp;&nbsp;</div>
        <button onClick={this.props.closeModal} style={{marginTop: '20px'}}>view a preview of the app</button>

      </div>
      );
    }

    let className = "overlay";
    if (this.props.appData.self.googleAuth === false) className += " fade-background";

    return (
      <Portal
        isOpened={this.props.appData.onboardModal}
        beforeClose = {this.beforeClose}
      >
          <div className={className}>
              <div className="overlay-content">
                  <Isvg src="/images/climaCal.svg" ></Isvg>
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
  closeModal : React.PropTypes.func.isRequired
};
// OnboardComponent.defaultProps = {};

export default OnboardComponent;
