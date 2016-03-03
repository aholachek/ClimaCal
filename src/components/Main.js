require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import Isvg from 'react-inlinesvg';
import _ from 'lodash';
import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Calendar from './../modules/calendar';
import Menu from 'react-burger-menu';
const AnimMenu = Menu.scaleRotate;

import TabComponent from './TabComponent';
import CalendarContainerComponent from './CalendarContainerComponent';
import OnboardComponent from './OnboardComponent';

import AppStateManager from './../modules/data_store';


class AppComponent extends React.Component {

  constructor(props) {
    super(props);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  onTabChange (targetName, e) {
    e.preventDefault();
    let newState = AppStateManager.getState();
    newState.tab = targetName;
    AppStateManager.setState(newState);
  }

  changeState (state){
    let newState = AppStateManager.getState();
    _.extend(newState, state);
    AppStateManager.setState(newState);
  }


  render () {

    let forecast, day, calendar, tabs;
    let today, tomorrow;

    //use moment.js for dates because browser implementations of new Date() are inconsistent!
    // (some use UTC, others like chrome take time zone into account)

    //use stub data or google data?
    if ( this.props.data.auth === 'self' && this.props.data.self.calendar && this.props.data.self.weather ){

      today = moment().hour(0).minute(0).second(0);
      tomorrow = moment(today).add(1, 'day');

      forecast = (this.props.data.tab === 'today')  ? this.props.data.self.weather.today : this.props.data.self.weather.tomorrow;
      day = (this.props.data.tab === 'today') ? today : tomorrow;
      calendar = this.props.data.self.calendar;
      tabs = [
          {onTabChange : this.onTabChange.bind(this, 'today'), title : 'today', weather :  this.props.data.self.weather.today.daily.data[0]},
          {onTabChange : this.onTabChange.bind(this, 'tomorrow'), title : 'tomorrow', weather :  this.props.data.self.weather.tomorrow.daily.data[0]}
      ];
    }
    else {
      //show stub data
      today = moment('2016-01-28T00:00:00.196-0500');
      tomorrow = moment('2016-01-29T00:00:00.196-0500');
      forecast = (this.props.data.tab === 'today')  ? this.props.data.stub.weather.today : this.props.data.stub.weather.tomorrow;
      day = (this.props.data.tab === 'today')  ? today  :  tomorrow;
      calendar = this.props.data.stub.calendar;
      tabs = [
          {onTabChange : this.onTabChange.bind(this, 'today'), title : 'today', weather :  this.props.data.stub.weather.today.daily.data[0]},
          {onTabChange : this.onTabChange.bind(this, 'tomorrow'), title : 'tomorrow', weather :  this.props.data.stub.weather.tomorrow.daily.data[0]}
      ];

    }

    let compareFormat = "ddd MMM DD YYYY";

    //get data for calendar container and pass it in
    let daySchedule = calendar.filter(function(d) {
      return d.start.dateTime && moment(d.start.dateTime).format(compareFormat) === day.format(compareFormat);
    });

    let allDayTasks = calendar.filter(function(d) {
      return !d.start.dateTime && moment(d.start.date).format(compareFormat) === day.format(compareFormat);
    });


  let authorizeUI;
  let hasPersonalData = this.props.data.self.googleAuth && this.props.data.self.weather;

  if ( hasPersonalData ){
    let that = this;
    if (this.props.data.auth === "self"){
      let setView = this.changeState.bind(this, {auth : 'stub' });
      let func = function(){ setView(); that.toggleMenu(false); };
      authorizeUI = (<span><h3>currently viewing <em>your own schedule</em></h3> <a className="bm-menu__item" onClick={func}><i className="fa fa-eye"></i> view sample data</a></span>)
    }
    else {
      let setView = this.changeState.bind(this, {auth : 'self'});
      let func = function(){ setView(); that.toggleMenu(false); };
      authorizeUI = (<span><h3>currently viewing a <em>sample schedule</em></h3><a className="bm-menu__item"  onClick={func}><i className="fa fa-eye"></i> view my data</a></span>)
    }

  }
  else {
    authorizeUI = (
      <span>
        <h3>currently viewing sample data</h3>
        <br/>
        <button className="load-google" onClick={function(){ Calendar.handleAuthClick()}}> load my Google calendar</button>
      </span>
                )
  }

  let updateMenuOpen = function(state){
    this.toggleMenu(state.isOpen);
  }.bind(this);


  let appOptions = (
     <div className="section">
      <a className="bm-menu__item" href='https://calendar.google.com/calendar/render' target='_blank'><i className='fa fa-google'></i><span>edit my calendar</span></a>
      <a className="bm-menu__item" href={'https://forecast.io/#/f/' + this.props.latLong} target='_blank'><i className='fa fa-sun-o'></i><span>detailed forecast</span></a>
    </div>)

    return (
      <div id="outer-container" ref="container" onClick={this.hide}>

            <AnimMenu pageWrapId={ "page-wrap" }
                      outerContainerId={ "outer-container" }
                      isOpen = {this.props.data.menuOpen}
                      onStateChange = {updateMenuOpen}
                      right
                      customIcon={ '/images/menu_icon.svg' }
                      >
            <br/>
            <div className="section">
              {authorizeUI}
            </div>

            { hasPersonalData? appOptions : <div></div> }

            <div className="section">
              <a className="bm-menu__item" href="https://github.com/aholachek/ClimaCal"><i className="fa fa-github-alt"></i><span>view the code</span></a>
            </div>
        </AnimMenu>

          <div className="navbar">
            <div className="responsive-container">
              <div className="climacal-logo">
                <img src="/images/climacal.png"/>
                  <h1>
                      ClimaCal
                  </h1>
              </div>
            </div>
          </div>

          <main id="page-wrap" className="responsive-container">
            <TabComponent
              tabs={tabs}
              active={this.props.data.tab}>
            </TabComponent>
            <CalendarContainerComponent
              forecast= {forecast}
              calendar= {daySchedule}
              allDayTasks= {allDayTasks}
              today = {this.props.data.tab == "today" ? today : tomorrow}
              latLong = {this.props.data.self.latLong}
              >
              </CalendarContainerComponent>
          </main>

            <OnboardComponent
               appData = {this.props.data}
               >
             </OnboardComponent>

      </div>

    );
  }


toggleMenu (val) {
  this.changeState({menuOpen : val});
}

}

AppComponent.defaultProps = {};

export default AppComponent;
