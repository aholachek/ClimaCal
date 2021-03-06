'use strict';

import React from 'react';
import Popover from 'react-popover';
import Moment from 'moment';

import AllDayTask from './AllDayTaskComponent';
import Colors from './../config/colors';

class CalendarWeekViewDayComponent extends React.Component {

  renderWeather() {

    let popoverBody = (
      <div>
        <button className="Popover__button" onClick={ this.props.setPopover.bind(undefined, id) }>
          <i className="fa fa-lg fa-times"/>
        </button>
        {this.props.weather.summary}
      </div>
    );
    let id = 'weekly-page--weather-' + this.props.day.format();

    return (
      <Popover isOpen={this.props.popover === id} body={popoverBody}>
        <div className="calendar-week__day__weather" onClick={ this.props.setPopover.bind(undefined, id) }>
          <div className="calendar-week__temperature">
            {Math.floor(this.props.weather.apparentTemperatureMin)}&deg;
          </div>
          <div className="calendar-week__icon-container">
            <i className={"wi wi-forecast-io-" + this.props.weather.icon + " calendar-week__icon"} aria-label={this.props.weather.summary}></i>
          </div>
          <div className="calendar-week__temperature">
            {Math.floor(this.props.weather.apparentTemperatureMax)}&deg;
          </div>
        </div>
      </Popover>
    );
  }

//for list entries
  renderPopoverBody(item){
    return <div>
      <button className="Popover__button" onClick={ this.props.setPopover.bind(undefined, item.id) }>
        <i className="fa fa-lg fa-times"/>
      </button>
      <h5>{item.summary}</h5>
      <a href={item.htmlLink} target='_blank' className="Popover__edit-link">
        <i className='fa fa-pencil-square-o' aria-hidden="true"></i>
        edit
      </a>
    </div>
  }

  renderCalendar() {

    let that = this,
        allDayTasks = this.props.calendar.allDayTasks.map(function (t) {

      if (t) {

        let id = 'weekly-page--all-day-task--' + t.id;
        let popoverBody = this.renderPopoverBody(t);

        return (
          <Popover isOpen= {that.props.popover === id} body={popoverBody} key={id} >
            <AllDayTask data={t} borderSide="borderLeft" setPopover={that.props.setPopover.bind(undefined, id)}/>
          </Popover>
        );
      } else {
        return ("");
      }
    }, this).filter(function (t) {
      return t;
    });

    let scheduleTasks = this.props.calendar.daySchedule.map(function (s) {

      if (s) {

        let popoverBody = this.renderPopoverBody(s);

        let start = Moment(s.start.dateTime).format("h:mma");
        start = start.slice(0, start.length - 1);
        let background = Colors.event[s.colorId || 9].background;
        let id = 'weekly-page--calendar-entry--' + s.id;

        return (
          <Popover isOpen={that.props.popover === id} body={popoverBody} key={id} >
            <li className="calendar-week__time-event" onClick={that.props.setPopover.bind(undefined, id)}>
              <span className="calendar-week__time-event__tag" style={{
                borderRight: "4px solid " + background
              }}>
                {start}
              </span>
              &nbsp; {s.summary}
            </li>
          </Popover>
        );
      } else {
        return ("");
      }
    }, this).filter(function (t) {
      return t;
    });

    let calendarWeekDayCalendar;

    if (allDayTasks.length + scheduleTasks.length > 0) {
      calendarWeekDayCalendar = (
        <div className="calendar-week__day__calendar">
          <ul className="calendar-week__all-day-tasks">{allDayTasks}</ul>
          <ul className="calendar-week__schedule-tasks">{scheduleTasks}</ul>
        </div>
      );
    } else {
      calendarWeekDayCalendar = (
        <div className="calendar-week__no-entries">schedule is empty</div>
      );
    }

    return calendarWeekDayCalendar;

  }

  render() {

    let today;
    if (this.props.day.date() === Moment().date()) {
      today = true;
    }

    return (
      <li className="calendar-week__day">
        <h4>{this.props.day.format("ddd, MMM D")} {today ? '(today)' : ''}</h4>
        {this.renderCalendar()}
        {this.renderWeather()}
      </li>
    );
  }
}

CalendarWeekViewDayComponent.displayName = 'CalendarWeekViewDayComponent';

CalendarWeekViewDayComponent.propTypes = {
  calendar: React.PropTypes.object.isRequired,
  day: React.PropTypes.object.isRequired,
  popover: React.PropTypes.string,
  setPopover: React.PropTypes.func.isRequired,
  weather: React.PropTypes.object.isRequired
};

export default CalendarWeekViewDayComponent;
