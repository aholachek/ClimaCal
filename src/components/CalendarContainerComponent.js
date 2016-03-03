import React from 'react';
import _ from 'lodash';
import {Scrollbars} from 'react-custom-scrollbars';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import moment from 'moment';

import CalendarEntryComponent from './CalendarEntryComponent';
import CalendarHourComponent from './CalendarHourComponent';
import AllDayTask from './AllDayTaskComponent';
import CalendarLayout from './../modules/calendar_layout';

class CalendarContainerComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      popover: undefined
    }

    this.closeChildPopovers = this.closeChildPopovers.bind(this);
  }

  renderCalendarEntries() {

    let that = this;

    //get layout data
    let calendarData = CalendarLayout(this.props.calendar);

    //items in the calendar
    var calendarEntries = calendarData.map(function(c) {
      let id = JSON.stringify(_.omit(c, 'layout'));

      let setPopover = function(){
        let p = (that.state.popover == id) ? undefined : id;
        that.setState({'popover': p});
      };

      return (

        <CalendarEntryComponent
          key= {id}
          data= {c}
          popover={that.state.popover === id}
          setPopover= {setPopover}>
        </CalendarEntryComponent>
      )
    });

    return calendarEntries;

  }

  renderHourEntries () {

    let that = this;
    let sun = [moment(this.props.forecast.daily.data[0].sunriseTime, 'X'), moment(this.props.forecast.daily.data[0].sunsetTime, 'X')];

    //hourly forecast + background for calendar
    let hourEntries = this.props.forecast.hourly.data.map(function(f) {
      let id = JSON.stringify(f);

    let setPopover = function(){
        let p = (that.state.popover == id) ? undefined : id;
        that.setState({'popover': p});
      };

      return (
        <CalendarHourComponent
          key= {id}
          data= {f}
          sun= {sun}
          popover= {that.state.popover == JSON.stringify(f)}
          setPopover= {setPopover}>
        </CalendarHourComponent>
      )
    });

    return hourEntries;
  }

  renderAllDayTasks () {

    let allDayTasks = this.props.allDayTasks.map(function(d) {

      let id = JSON.stringify(d);
      let setPopover = function(){
        let p = (this.state.popover == id) ? undefined : id;
        this.setState({'popover': p});
      }.bind(this);

      return <AllDayTask
        data={d}
        key={id}
        setPopover= {setPopover}
        popover= {this.state.popover == JSON.stringify(d)}
        />

    }.bind(this));

    return allDayTasks;

  }

  render () {

    let calendarEntries = this.renderCalendarEntries();
    let hourEntries = this.renderHourEntries();
    let allDayTasks = this.renderAllDayTasks();

    let noHourEntries = (
      <div className='no-hour-entries'>Schedule is empty</div>
    );

    this.children = calendarEntries;

    return (
      <div className='calendar'>
        <div className='calendar-top'>
          <div className='date'>
            <h3>{this.props.today.format("ddd, MMM DD")}</h3>
          </div>
          <div className='all-day-tasks'>
            <ul>
              <ReactCSSTransitionGroup transitionName="calendar-entry-animation" transitionEnterTimeout={500} transitionLeave={false}>
              {allDayTasks}
            </ReactCSSTransitionGroup>
            </ul>
          </div>

        </div>
        <Scrollbars ref='scrollbars' onScroll={this.closeChildPopovers}>
          <div className='calendar__container'>
            <ol>
              {hourEntries}
            </ol>

            <ol className='calendar__entrylist'>
              <ReactCSSTransitionGroup transitionName="calendar-entry-animation" transitionEnterTimeout={500} transitionLeaveTimeout={10}>
                {calendarEntries}
                </ReactCSSTransitionGroup>
            </ol>
          </div>
        </Scrollbars>
        {calendarEntries.length === 0 ? noHourEntries  : null }
        <div className='calendar-bottom'></div>
      </div>
    );

  }

  closeChildPopovers () {
    if (this.state.popover) {
      this.setState({'popover': null});
    }
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
  calendar: React.PropTypes.array.isRequired,
  allDayTasks: React.PropTypes.array.isRequired,
  today : React.PropTypes.object.isRequired,
  latLong : React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.bool
    ]).isRequired
};

export default CalendarContainerComponent;
