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
    this.scrollToEight = this.scrollToEight.bind(this);
    this.state = {
      accessibilityFrom : undefined,
      accessibilityTo : undefined,
      mobileTab : 'hourView'
      }
  }

  renderCalendarEntries() {

    let that = this;
    //get layout data
    let calendarData = CalendarLayout(this.props.calendar.daySchedule);
    //items in the calendar
    var calendarEntries = calendarData.map(function(c) {

      let id = 'daily-page--calendar-entry--' + c.id;

      let startHour = moment(c.start.dateTime).hour();
      let timeLink = "#" + "row-" + startHour;

      return (

        <CalendarEntryComponent
          key= {id}
          id = {id}
          data= {c}
          timeLink = { timeLink }
          popover={that.props.popover === id}
          setPopover= {that.props.setPopover.bind(undefined, id)}
          setAccessibilityEntry = {function(){
            this.setState({
              accessibilityFrom : id,
              accessibilityTo : startHour
            });
            setTimeout(function(){
              document.querySelector( timeLink ).focus();
            }, 1000);
          }.bind(this)}
          >
        </CalendarEntryComponent>
      );
    }, this);

    return calendarEntries;

  }

  renderHourEntries () {

    let that = this;
    let sun = [this.props.forecast.daily.sunriseTime, this.props.forecast.daily.sunsetTime];

    //hourly forecast + background for calendar
    let hourEntries = this.props.forecast.hourly.map(function(f) {

    let id = 'daily-page--hour-weather--' + f.time;

      return (
        <CalendarHourComponent
          key= {id}
          data= {f}
          sun= {sun}
          popover= {that.props.popover === id}
          setPopover= {that.props.setPopover.bind(undefined, id)}
          setAccessibilityEntry = {
            function(){
              var accessibilityFrom = this.state.accessibilityFrom;
              var onTimeout = function(){
                  document.querySelector( "#" + accessibilityFrom ).focus();
              }.bind(this);
              setTimeout(onTimeout, 1000);
              this.setState({
                accessibilityFrom : undefined,
                accessibilityTo : undefined
              });
          }.bind(this)
        }
          hasAccessibilityLink = { moment(f.time).hour() === this.state.accessibilityTo }
           >
        </CalendarHourComponent>
      );

    }, this);

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
        <a className='no-hour-entries' href='https://calendar.google.com/calendar/render' target='_blank'>
      <div>
        <div> <i className="fa fa-2x fa-calendar-plus-o"></i></div>
        <br/>
        <div> add an event </div>
      </div>
    </a>

    );

    this.children = calendarEntries;

    let onScroll = this.props.setPopover.bind(undefined, null);

    let hourContainer;

    //these animations look terrible on mobile
    if (document.body.clientWidth > 600) {
      hourContainer =  <VelocityTransitionGroup
       component='ol'
       enter={{
         animation: 'transition.slideDownIn',
         display : 'flex',
         drag : true,
         stagger: '30ms'
       }}
       runOnMount
       >
       { hourEntries }
     </VelocityTransitionGroup>
   } else {
      hourContainer = <ol> {hourEntries}</ol>
   }

    return (
      <VelocityTransitionGroup
        component='div'
        className='calendar'
        enter={{
          animation: 'transition.fadeIn'
        }}
        runOnMount
        >
        <div className='calendar-top'>
          <div className='calendar-top__day-description'>
            <span>
            <b>{this.props.today.format('ddd, MMM DD')}</b>:&nbsp;{this.props.forecast.daily.summary}&nbsp;
                <span className='small-inline'>
                  <b>
                  {Math.floor(this.props.forecast.daily.apparentTemperatureMin)}&deg;-
                  {Math.floor(this.props.forecast.daily.apparentTemperatureMax)}&deg;
                </b>
                </span>
              </span>
          </div>
          <div className='mobile-tabs' role='tablist'>
              <div className={this.state.mobileTab === 'allDayView' ? 'active' : ''} >
                <button onClick={function(){this.setState({mobileTab : 'allDayView'})}.bind(this)}
                  role='tab'
                  aria-selected = {this.state.mobileTab === 'allDayView' ? true : false }
                  aria-controls = 'all-day-task-container'
                  >
                  <b>all day</b> ( {allDayTasks.length} )
                </button>
              </div>
              <div className = {this.state.mobileTab === 'hourView' ? 'active' : ''} >
              <button onClick={function(){this.setState({mobileTab : 'hourView'})}.bind(this)}
                role='tab'
                aria-selected = {this.state.mobileTab === 'hourView' ? true : false}
                aria-controls = 'schedule-task-container'
                >
                <b>schedule</b> ( {calendarEntries.length} )
              </button>
              </div>
          </div>
          <div className= {this.state.mobileTab === 'hourView' ? 'small-invisible' : ''} id='all-day-task-container'>
            <h4 className='sr-only'>Calendar events with no defined start and end dates for the day</h4>
            <div className='all-day-tasks'>
              <ul>
                {allDayTasks}
              </ul>
            </div>
          </div>

        </div>
        <div className= {this.state.mobileTab === 'allDayView' ? 'small-invisible' : ''}
          id ='schedule-task-container'
          >
        <Scrollbars ref='scrollbars'
                    onScroll={onScroll}
                    autoHide={true}
                    autoHideTimeout={1000}
                    autoHideDuration={200} >
          <div className='calendar__container'>
            {
              calendarEntries.length > 1 ?
              <h4 className='sr-only'>Calendar events with defined start and end dates for the day</h4>
                : <h4 className='sr-only'>No calendar entries</h4>
            }
            <VelocityTransitionGroup
             component='ol'
             enter={{
               animation: 'transition.fadeIn',
               drag : true,
               stagger : '200ms'
             }}
             className='calendar__entrylist'
             runOnMount
             >
             {calendarEntries}
           </VelocityTransitionGroup>

            <h4 className='sr-only'>Hourly weather information</h4>
             { hourContainer }
          </div>
        </Scrollbars>
        {calendarEntries.length === 0 ? noHourEntries  : null }
        </div>
    </VelocityTransitionGroup>
    );

  }

  scrollToEight (){
    let hourHeight = (document.body.clientWidth < 600) ? 82 : 42;
    this.refs.scrollbars.scrollTop(hourHeight * 8);
  }

  componentDidMount () {
    let scrollToEight = this.scrollToEight;
    setTimeout(function(){
      scrollToEight()
    }, 100);
  }

  componentDidUpdate (newProps) {
    let scrollToEight = this.scrollToEight;
    if (newProps.today.toString() === this.props.today.toString()) return;
    setTimeout(function(){
      scrollToEight()
    }, 100);
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
