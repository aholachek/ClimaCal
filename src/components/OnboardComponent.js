'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Portal from 'react-portal';
import Isvg from 'react-inlinesvg';


class OnboardComponent extends React.Component {

  constructor(props) {
    super(props);
    this.previewClick = this.previewClick.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
  }

  beforeClose (node, removeFromDom) {
    node.querySelector(".overlay").classList.add("fade-out-up");
    window.setTimeout(function(){
      removeFromDom();
    }, 500);

  }

  previewClick () {

    let newState = {};
    newState.onboardModal = false;
    //if there's an error, the person has seen the message, now delete it
    if (this.props.appData.error ){
      newState.error = false;
    }
    this.props.changeState(newState);
  }

  render() {
    let container;

    if (this.props.appData.error){
      container = (
        <div>
          <p> <i className="fa fa-warning"></i> { this.props.appData.error } </p>
          <p> <button id="preview-app-button" onClick={this.previewClick} style={{marginTop: '20px'}}> Try checking out the app preview instead </button> </p>
        </div>
      );

    }

  else if (
      //if undefined, hasn't returned. if false, it's not available (might have been an error)
      this.props.appData.auth === "self" && (
        (this.props.appData.self.weather === undefined) || (this.props.appData.self.calendar === undefined)
      )||
      //if equal to undefined, initial loading check is in progress
      this.props.appData.self.googleAuth === undefined
        ){

      container = (<div className="overlay-details" style={{paddingTop: '80px'}}> loading <b>ClimaCal...</b> </div>);
    }
    else {

      container = (
      <div className="overlay-details">
        <h1 className="sr-only">
            ClimaCal
        </h1>

        <div>
          <button onClick={ this.props.googleAuthorize } style={{marginBottom: '20px'}}> load my calendar + local weather data </button>
          </div>
          <div style = {{marginBottom : "20px"}}>
            <span className="explanation">(requests Google calendar for next 8 days & current location)</span>
          </div>
          <hr/>
         <div>
           <button id="preview-app-button" onClick={this.previewClick} style={{marginTop: '20px'}}>or view a preview of the app</button>
        </div>

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
                <img src="/images/climacal.png"/>
              {container}
              </div>
        </div>
      </Portal>
    );
  }


}

OnboardComponent.displayName = 'OnboardComponent';

OnboardComponent.propTypes = {
  appData : React.PropTypes.object.isRequired,
  changeState : React.PropTypes.func.isRequired
};
// OnboardComponent.defaultProps = {};

export default OnboardComponent;
