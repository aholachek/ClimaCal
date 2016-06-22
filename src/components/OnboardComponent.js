'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Portal from 'react-portal';
import Isvg from 'react-inlinesvg';
import Popover from 'react-popover';


class OnboardComponent extends React.Component {

  constructor(props) {
    super(props);
    this.previewClick = this.previewClick.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    this.state = {
      popover : false
    }
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

  authorizeApp (e) {
    e.preventDefault();
    var placeName = e.target.parentNode.parentNode.querySelector("input").value;
    this.props.getWeatherData(placeName);
    this.props.googleAuthorize();
  }

  render() {
    let container;

    if (this.props.appData.error){
      container = (
        <div>
          <p> <i className="fa fa-warning"></i> { this.props.appData.error } </p>
          <p> <button className = "btn" id="preview-app-button" onClick={this.previewClick} style={{marginTop: '20px'}}> Try checking out the app preview instead </button> </p>
        </div>
      );
    }

  else if (
      //if undefined, hasn't returned. if false, it's not available (might have been an error)
      this.props.appData.auth === 'self' && (
        (this.props.appData.self.weather === undefined) || (this.props.appData.self.calendar === undefined)
      )||
      //if equal to undefined, initial loading check is in progresss
      this.props.appData.self.googleAuth === undefined
      ){
      container = (<div className="overlay-details" style={{paddingTop: '200px', color: '#a4a4a4', fontWeight: 'bold', minHeight: '400px', minWidth: '500px'}}>
       loading <b>ClimaCal...</b>
     </div>);
    }
    else {

      let popoverAbout = (
        <div>
          <button className="Popover__button" onClick={ function(){this.setState({popover : false})}.bind(this) }>
            <i className="fa fa-lg fa-times"/>
          </button>
          <p>This is a side project I built to help me learn how to use some new web technologies.
          </p>
          <p>
          If you'd like to take a look at the code,
          <a href="https://github.com/aholachek/ClimaCal" target="__blank">&nbsp;
          check out the Github repo.
          </a>
          </p>
        </div>
      );
      let aboutButton =   <Popover isOpen={ this.state.popover === 'about'} body={popoverAbout}>
        <button onClick={function(){this.state.popover === 'about' ? this.setState({popover : false}) : this.setState({popover : 'about'})}.bind(this)}>
          <i className="fa fa-info-circle"></i> About this app
        </button>
      </Popover>

      let popoverPrivacy = (
        <div>
          <button className="Popover__button" onClick={ function(){this.setState({popover : false})}.bind(this) }>
            <i className="fa fa-lg fa-times"/>
          </button>
          <p>
            This app requests your email address and calendar information for the next week from Google.</p>
          <p>
            Neither the location that you enter or any of your Google data is recorded in any way.
          </p>
        </div>
      );

      let privacyButton =   <Popover isOpen={ this.state.popover === 'privacy' } body={popoverPrivacy}>
        <button onClick={function(){this.state.popover === 'privacy' ? this.setState({popover : false}) : this.setState({popover : 'privacy'})}.bind(this)}>
                <i className="fa fa-user-secret"></i> Privacy
            </button>
       </Popover>

      container = (
      <div className="overlay-details">
        <h1 className="sr-only">
            ClimaCal
        </h1>
        <div>
          <p style={{color: '#a4a4a4', fontWeight: 'bold', marginTop: '35px'}}>
            ClimaCal connects your calendar with an hourly weather report.
          </p>
          <form className="pure-form">
            <div>
              <br/>
              <label> <b>1.</b> Set your location:&nbsp;&nbsp;
              <input type="text" placeholder="city, state/region"/>
              </label>
            </div>
            <div style={{marginTop : "10px"}}>
              <b>2.</b> Import your Google calendar:&nbsp;&nbsp;
              <button className="btn" onClick={ this.authorizeApp.bind(this) } style={{margin: '10px 0', width: '110px'}}>import </button>
            </div>
          </form>
          <hr/>
         <div className="preview-container">
           Or preview the interface:&nbsp;&nbsp;<button className="btn" id="preview-app-button" onClick={this.previewClick} style={{margin: '20px 0', width: '174px'}}>view preview</button>
        </div>
      </div>
      <div className="overlay-app-info">
        { aboutButton } &nbsp;&nbsp;&nbsp; { privacyButton }

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
