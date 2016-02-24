'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
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
      container = (<div> <i className="fa fa-spinner fa-pulse"></i> Loading ... </div>)
    }
    else {
      container = (
      <div>

        <button onClick={this._authorize}> load my calendar + local weather data * </button>
        <div>&nbsp;&nbsp;or&nbsp;&nbsp;</div>
        <button onClick={this.props.closeModal}>preview app</button>

        <p>
           * The only data requested is the content of your Google Calendar for today and tomorrow,<br/>
          and your geographical position. Other identifying information is not required.
        </p>

      </div>
      );
    }

    return (
      <Modal
        isOpen={this.props.appData.onboardModal}>
        <div className="modal-content" ref="container">
          <div className="climacal-logo">
            <Isvg src="/images/climaCal.svg" ></Isvg>
              <h1>
                  ClimaCal
              </h1>
          </div>

        <p>An integrated daily view of your Google calendar and local weather information. </p>
        {container}
      </div>
      </Modal>

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
