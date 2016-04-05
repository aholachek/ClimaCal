import React from 'react';
import _ from 'lodash';
import {Scrollbars} from 'react-custom-scrollbars';

import { VelocityTransitionGroup } from 'velocity-react';
import Velocity from 'velocity-animate';
import VelocityUI from 'velocity-animate/velocity.ui';

import moment from 'moment';

import CalendarEntryComponent from './CalendarEntryComponent';
import CalendarHourComponent from './CalendarHourComponent';
import AllDayTask from './AllDayTaskComponent';
import CalendarLayout from './../modules/calendar_layout';

class CalendarContainerComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {mobileTab: 'hourView'};
  }

  renderCalendarEntries() {

    let that = this;
    //get layout data
    let calendarData = CalendarLayout(this.props.calendar.daySchedule);
    //items in the calendar
    var calendarEntries = calendarData.map(function(c) {

      let id = 'daily-page--calendar-entry--' + c.id;

      return (

        <CalendarEntryComponent
          key= {id}
          data= {c}
          popover={that.props.popover === id}
          setPopover= {that.props.setPopover.bind(undefined, id)}>
        </CalendarEntryComponent>
      );
    });

    return calendarEntries;

  }

  renderHourEntries () {

    let that = this;
    let sun = [moment(this.props.forecast.daily.sunriseTime, 'X'), moment(this.props.forecast.daily.sunsetTime, 'X')];

    //hourly forecast + background for calendar
    let hourEntries = this.props.forecast.hourly.map(function(f) {

    let id = 'daily-page--hour-weather--' + f.time;


      return (
        <CalendarHourComponent
          key= {id}
          data= {f}
          sun= {sun}
          popover= {that.props.popover === id}
          setPopover= {that.props.setPopover.bind(undefined, id)} >
        </CalendarHourComponent>
      );
    });

    return hourEntries;
  }

  renderAllDayTasks () {

    var that = this;

    let allDayTasks = this.props.calendar.allDayTasks.map(function(d) {

      let id = 'daily-page--all-day--' + d.id;

      return (<AllDayTask
        data={d}
        key={id}
        setPopover= { that.props.setPopover.bind(undefined, id) }
        popover= {that.props.popover === id}
        />);

    }.bind(this));

    return allDayTasks;

  }

  render () {

    let calendarEntries = this.renderCalendarEntries();
    let hourEntries = this.renderHourEntries();
    let allDayTasks = this.renderAllDayTasks();

    let noHourEntries = (
      <div className='no-hour-entries'>schedule is empty</div>
    );

    this.children = calendarEntries;

    let onScroll = this.props.setPopover.bind(undefined, null);

    return (
      <div className='calendar'>
        <div className='calendar-top'>
          <div className='calendar-top__day-description'>
            <span>
            <h4>{this.props.today.format("ddd, MMM DD")}</h4>:&nbsp;{this.props.forecast.daily.summary}&nbsp;
                <span className="small-inline">
                  <b>
                  {Math.floor(this.props.forecast.daily.apparentTemperatureMin)}&deg;-
                  {Math.floor(this.props.forecast.daily.apparentTemperatureMax)}&deg;
                </b>
                </span>
              </span>
          </div>
          <div className="mobile-tabs">
              <div className={this.state.mobileTab === 'allDayView' ? 'active' : ''}>
                <button onClick={function(){this.setState({mobileTab : 'allDayView'})}.bind(this)}>
                  <b>all day</b> ( {allDayTasks.length} )
                </button>
              </div>
              <div className = {this.state.mobileTab === 'hourView' ? 'active' : ''}>
              <button onClick={function(){this.setState({mobileTab : 'hourView'})}.bind(this)}>
                <b>schedule</b> ( {calendarEntries.length} )
              </button>
              </div>
          </div>
          <div className= {this.state.mobileTab === 'hourView' ? 'small-invisible' : ''}>
            <div className='all-day-tasks'>
                <VelocityTransitionGroup
                  component="ul"
                  enter={{
                    animation: "transition.expandIn",
                    drag : true,
                    stagger: "100ms"
                  }}
                  runOnMount
                  >
                  {allDayTasks}
                </VelocityTransitionGroup>
            </div>
          </div>

        </div>
        <div className= {this.state.mobileTab === 'allDayView' ? 'small-invisible' : ''}>
        <Scrollbars ref='scrollbars'
                    onScroll={onScroll}
                    autoHide={true}
                    autoHideTimeout={1000}
                    autoHideDuration={200} >
          <div className='calendar__container'>
            <ol>
              {hourEntries}
            </ol>
            <VelocityTransitionGroup
              component="ol"
              enter={{
                animation: "transition.expandIn",
                drag : true,
                stagger: "100ms"
              }}
              className='calendar__entrylist'
              runOnMount
              >
              {calendarEntries}
            </VelocityTransitionGroup>

          </div>
        </Scrollbars>
        </div>
        {calendarEntries.length === 0 ? noHourEntries  : null }
        <div className='calendar-bottom'></div>
      </div>
    );

  }

  componentDidMount () {
    let hourHeight = (document.body.clientWidth < 600) ? 82 : 42;
    this.refs.scrollbars.scrollTop(hourHeight * 8);
  }

  componentDidUpdate (newProps) {
    if (newProps.today === this.props.today) return;
    let hourHeight = (document.body.clientWidth < 600) ? 82 : 42;
    this.refs.scrollbars.scrollTop(hourHeight * 8);
  }

}

CalendarContainerComponent.displayName = 'CalendarContainerComponent';


CalendarContainerComponent.propTypes = {
  forecast: React.PropTypes.object.isRequired,
  calendar: React.PropTypes.object.isRequired,
  popover: React.PropTypes.string,
  setPopover : React.PropTypes.func.isRequired,
  today : React.PropTypes.object.isRequired,

};

export default CalendarContainerComponent;
