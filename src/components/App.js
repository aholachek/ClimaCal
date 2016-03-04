require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import Isvg from 'react-inlinesvg';
import _ from 'lodash';
import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { VelocityTransitionGroup, VelocityComponent } from 'velocity-react';
import Velocity from 'velocity-animate';
import VelocityUI from 'velocity-animate/velocity.ui';

import Menu from 'react-burger-menu';
const AnimMenu = Menu.scaleRotate;

import TabComponent from './TabComponent';
import CalendarDayViewContainer from './CalendarDayViewContainer';
import CalendarWeekViewContainer from './CalendarWeekViewContainer';


import OnboardComponent from './OnboardComponent';

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.setPopover = this.setPopover.bind(this);
  }

  onTabChange (targetName, e) {
    e.preventDefault();
    this.props.changeState({ tab : targetName });
  }

  setPopover (id) {
    if (id === null && this.props.data.popover === null) return;
    let p = (this.props.data.popover == id) ? null : id;
    this.props.changeState({popover : p });
  }

  useOwnData () {
      if ( this.props.data.auth === 'self' && this.props.data.self.calendar && this.props.data.self.weather ){
        return true;
      }
      else {
        return false;
      }
  }

  renderContainerComponent () {

    let today, tomorrow, key;
    //use moment.js for dates because browser implementations of new Date() are inconsistent!
    if (this.useOwnData()){
      today = moment().hour(0).minute(0).second(0);
      tomorrow = today.clone().add(1, 'day');
      key = 'self';
    }
    else {
      today = moment('2016-01-28T00:00:00.196-0500');
      tomorrow = moment('2016-01-29T00:00:00.196-0500');
      key = 'stub';
    }

    let forecast = this.props.data[key].weather[this.props.data.tab];

    let compareFormat = "ddd MMM DD YYYY";
    let scheduleData;

    function getScheduleForDay(calendar, day){

          return {
            daySchedule :  calendar.filter(function(d) {
              return d.start.dateTime && moment(d.start.dateTime).format(compareFormat) === day.format(compareFormat);
            }),
            allDayTasks : calendar.filter(function(d) {
              return !d.start.dateTime && moment(d.start.date).format(compareFormat) === day.format(compareFormat);
            })
          };
    }

    if (this.props.data.tab === 'today'){
      scheduleData = getScheduleForDay(this.props.data[key].calendar, today);
      return (
        <CalendarDayViewContainer
          forecast= {forecast}
          calendar= {scheduleData}
          today = {today}
          setPopover = {this.setPopover}
          popover = {this.props.data.popover}
          key= 'today-tab'
          />
      );
    }
    else if (this.props.data.tab === 'tomorrow'){
      scheduleData = getScheduleForDay(this.props.data[key].calendar, tomorrow);
      return (
        <CalendarDayViewContainer
          forecast= {forecast}
          calendar= {scheduleData}
          today = {tomorrow}
          setPopover = {this.setPopover}
          popover = {this.props.data.popover}
          key= 'tomorrow-tab'

          />
      );
    }
    else if (this.props.data.tab === 'this week'){
      //attach calendar information to the days array from the weather endpoint
      let days = [];
      let n = 0;
      while ( n <= 7 ){
        let day = today.clone().add(n, 'day');
        days.push({
          day : day,
          weather : this.props.data[key].weather['this week'].data[n],
          calendar : getScheduleForDay(this.props.data[key].calendar, day)
        });
        n++;
      }
      scheduleData = _.extend({}, this.props.data[key].weather['this week'], { data : days });

      return (
        <CalendarWeekViewContainer
          scheduleData = {scheduleData}
          today = {today}
          setPopover = {this.setPopover}
          popover = {this.props.data.popover}
          key='this-week-tab'
          />
      );
    }
  }

  renderTabs () {

    let key = this.useOwnData() ? 'self' : 'stub';
    let tabs = [
      //send summary info to tabs
        {onTabChange : this.onTabChange.bind(this, 'today'), title : 'today', weather :  this.props.data[key].weather.today.daily},
        {onTabChange : this.onTabChange.bind(this, 'tomorrow'), title : 'tomorrow', weather :  this.props.data[key].weather.tomorrow.daily},
        {onTabChange : this.onTabChange.bind(this, 'this week'), title : 'this week', weather :  this.props.data[key].weather['this week']}
    ];
    return (
              <TabComponent
                  tabs={tabs}
                  active={this.props.data.tab}/>
            );
  }

  renderAuthorizeUI () {

    let authorizeUI;
    let that = this;

    if ( this.useOwnData() ){
        let setView = this.props.changeState.bind(this, {auth : 'stub' });
        let func = function(){ setView(); that.toggleMenu(false); };
        authorizeUI = (<span><h3>currently viewing <em>your own schedule</em></h3>
          <a className="bm-menu__item" onClick={func}><i className="fa fa-eye"></i> view sample data</a><
            /span>);
    }
    else if (this.props.data.self.calendar && this.props.data.self.weather){
      let setView = this.props.changeState.bind(this, {auth : 'self'});
      let func = function(){ setView(); that.toggleMenu(false); };
      authorizeUI = (<span><h3>currently viewing a <em>sample schedule</em></h3>
      <a className="bm-menu__item"  onClick={func}><i className="fa fa-eye"></i> view my data</a>
      </span>);
    }
    else {
      authorizeUI = (
        <span>
          <h3 style={{ paddingBottom : '15px'}}>currently viewing sample data</h3>
          <button className="load-google" onClick={ this.props.googleAuthorize }> load my Google calendar</button>
        </span>
      );
    }

    return authorizeUI;
  }

  //combined render method
  render () {

  let updateMenuOpen = function(state){
    this.toggleMenu(state.isOpen);
  }.bind(this);

  let appOptions = (
     <div className="section">
      <a className="bm-menu__item" href='https://calendar.google.com/calendar/render' target='_blank'>
        <i className='fa fa-google'></i><span>edit my calendar</span>
      </a>
      <a className="bm-menu__item" href={'https://forecast.io/#/f/' + this.props.latLong} target='_blank'>
        <i className='fa fa-sun-o'></i><span>detailed forecast</span><
      /a>
    </div>);

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
              { this.renderAuthorizeUI() }
            </div>

            { this.useOwnData() ? appOptions : <div></div> }

            <div className="section">
              <a className="bm-menu__item" href="https://github.com/aholachek/ClimaCal">
                <i className="fa fa-github-alt"></i>
                <span>view the code</span></a>
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
           { this.renderTabs() }

           <VelocityTransitionGroup
             enter={{
              animation: "transition.fadeIn",
              duration: 400
            }}
             runOnMount
             >
             { this.renderContainerComponent() }
           </VelocityTransitionGroup>
          </main>

            <OnboardComponent
               appData = {this.props.data}
               changeState = {this.props.changeState}
               googleAuthorize = {this.props.googleAuthorize}
               >
             </OnboardComponent>

      </div>

    );
  }


  toggleMenu (val) {
    this.props.changeState({menuOpen : val});
  }

}

AppComponent.defaultProps = {};

export default AppComponent;
