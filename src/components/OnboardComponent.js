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
      this.props.appData.auth === "self" && (!this.props.appData.self.weather || this.props.appData.self.calendar) ||
      //if equal to undefined, initial loading check is in progress
      this.props.appData.self.googleAuth === undefined
        ){
      container = (<div> <i className="fa fa-spinner fa-pulse"></i> Loading ... </div>)
    }
    else {
      container = (
      <div>
        <p>
          The only data requested is the content of your next two calendar days on Google,<br/>
          and your geographical position. Other identifying information is not required.
        </p>

        <button onClick={this._authorize}> load my calendar + local weather data</button>
        <div>&nbsp;&nbsp;or&nbsp;&nbsp;</div>
        <button onClick={this.props.closeModal}>preview app</button>

      </div>
      );
    }

    return (
      <Modal
        isOpen={this.props.appData.onboardModal}>
        <div className="modal-content" ref="container">

          <div className="climatecal-logo">
            <Isvg src="../images/climateCal.svg" ></Isvg>
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

// Uncomment properties you need
OnboardComponent.propTypes = {
  data : React.PropTypes.object
};
// OnboardComponent.defaultProps = {};

export default OnboardComponent;
