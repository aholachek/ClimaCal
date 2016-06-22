require('styles/pure.scss');
require('styles/App.scss');


import React from 'react';
import _ from 'lodash';
import moment from 'moment';

import DropdownMenu from 'react-dd-menu';

import TabComponent from './TabComponent';
import CalendarDayViewContainer from './CalendarDayViewContainer';
import CalendarWeekViewContainer from './CalendarWeekViewContainer';

import { Router, Route, Link } from 'react-router';

import OnboardComponent from './OnboardComponent';


class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.setPopover = this.setPopover.bind(this);
    this.state = {
      isMenuOpen: false
    };
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

    let forecast = this.props.data[key].weather[this.props.params.splat];

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

    if (this.props.params.splat === 'today'){
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
    else if (this.props.params.splat === 'tomorrow'){
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
    else if (this.props.params.splat === 'this-week'){
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
        { title : 'today', weather :  this.props.data[key].weather.today.daily},
        { title : 'tomorrow', weather :  this.props.data[key].weather.tomorrow.daily},
        { title : 'this week', weather :  this.props.data[key].weather['this week']}
    ];
    return (
              <TabComponent
                  tabs={tabs}
                  active={ this.props.params.splat }/>
            );
  }

  renderHeader () {

    return ( <div>
      <span className="climacal-logo">
          <img src="/images/climacal.png" alt="climacal app logo" title="ClimaCal"/>
            <h1 className="sr-only">
                ClimaCal <span>an app to integrate gmail + local weather data</span>
            </h1>
        </span>
        { this.renderMenu() }
      </div> )
  }

  changeLocation (e) {
    e.preventDefault();
    var placeName = arguments[0].target.querySelector("input").value;
    if (placeName.trim()){
      this.props.getWeatherData(placeName);
    }
    this.setState({ isMenuOpen : false });
  }

  renderMenu () {

    let close = function(){this.setState( {isMenuOpen : false} ) }.bind(this);
    let toggle = function(){this.setState( {isMenuOpen : !this.state.isMenuOpen} ) }.bind(this);

    let menuOptions = {
     isOpen: this.state.isMenuOpen,
     close: close,
     align: 'right',
     closeOnInsideClick: false
    }

    let dropdownMenu;

    function changeView (auth){
      this.props.changeState({auth : auth });
      this.setState({isMenuOpen : false})
    }

    //fully authorized, showing user data OR fully authorized, showing stub
    if ( this.useOwnData() ) {

      let latLon = this.props.data.self.location.latitude + "," + this.props.data.self.location.longitude;
      let currentLocation;

      let placeParts = this.props.data.self.location.formattedAddress.split(',');
       placeParts = _.unique(_.map(placeParts, function(p){return p.trim()}));
       currentLocation = placeParts.join(", ");

       menuOptions = _.extend(menuOptions,
        {
          toggle: <button className = "pull-right btn" onClick={ toggle }> <i className="fa fa-user"></i> { this.props.data.self.googleAuth }</button>
      });

       dropdownMenu = <DropdownMenu {...menuOptions}>
         <li><a href="#" onClick= { changeView.bind(this, 'stub') }>
           <i className="fa fa-calendar-o"></i>&nbsp;&nbsp;Preview app with sample data</a>
         </li>
         <li>
           <a href="#" style={{paddingBottom: '0'}}><i className="fa fa-map-marker"></i>
             <span style={{position: 'relative', 'left' : '15px'}}>Location: <b>{ currentLocation }</b></span>
             <form className="pure-form" onSubmit={ this.changeLocation.bind(this) } style={{position: 'relative', 'left' : '25px'}}>
               <label>Change: <input type="text" placeholder="city, state/region" style={{marginRight : '20px'}} /></label></form>
           </a>
          </li>
          <li onClick= { function(){this.setState({isMenuOpen : false})}.bind(this)}><a href='https://calendar.google.com/calendar/render' target='_blank'>
            <i className="fa fa-pencil-square-o"></i>&nbsp;&nbsp;Edit Google calendar</a>
          </li>
          <li>
            <a href="#" onClick= { function(){ this.props.logOut(); this.setState({isMenuOpen : false}) }.bind(this) } >
              <i className="fa fa-sign-out" />&nbsp;Log out
            </a>
          </li>
        </DropdownMenu>
    }
    else if ( this.props.data.self.calendar && this.props.data.self.weather ) {

       menuOptions = _.extend(menuOptions,
        {
          toggle: <button className = "pull-right btn" onClick={ toggle }> <i className="fa fa-user"></i> App Preview </button>
      });

       dropdownMenu = <DropdownMenu {...menuOptions}>
         <li><a href="#" onClick={ changeView.bind(this, 'self') } style={{paddingRight: '100px'}}>
           <i className="fa fa-calendar-o"></i>&nbsp;&nbsp;Show my data</a>
         </li>
          <li>
            <a href="#" onClick= { function(){ this.props.logOut(); this.setState({isMenuOpen : false}) }.bind(this) } >
              <i className="fa fa-sign-out" />&nbsp;Log out
            </a>
          </li>
        </DropdownMenu>

    }
    //not authorized
    else {

        let currentLocation = 'App Preview';
        menuOptions = _.extend(menuOptions,
          {
            toggle: <button className = "pull-right btn" onClick={ toggle }> <i className="fa fa-user"></i> { currentLocation }</button>,
            closeOnInsideClick : true
        }
      );

        dropdownMenu = <DropdownMenu {...menuOptions}>
          <li style={{paddingRight: '100px'}}>
            <a href="#" onClick= { this.props.showLoginPage } ><i className="fa fa-calendar-o"></i>&nbsp;&nbsp;load my data</a>
          </li>
         </DropdownMenu>
    }

    return dropdownMenu

  }

  render () {

    return (
      <div className={ this.useOwnData() ? 'showing-own-data' : 'showing-stub-data'}>

        <div className="responsive-container">
          <nav className="navbar">
            { this.renderHeader() }
          </nav>
          <main>
            { this.renderTabs() }
            { this.renderContainerComponent() }
            </main>
         </div>

            <OnboardComponent
               appData = {this.props.data}
               changeState = {this.props.changeState}
               googleAuthorize = {this.props.googleAuthorize}
               getWeatherData = {this.props.getWeatherData}
               >
             </OnboardComponent>

      </div>
    );
  }

}

AppComponent.defaultProps = {};

export default AppComponent;
