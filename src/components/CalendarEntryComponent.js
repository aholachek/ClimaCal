'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import Popover from 'react-popover';
import Colors from './../config/colors';

class CalendarEntryComponent extends React.Component {

  render() {

    let colorId = this.props.data.colorId || '9';

    let taskColor = Colors.event[colorId].background
    let taskTextColor = Colors.event[colorId].foreground;

    let times = moment(this.props.data.start.dateTime)
      .format("hh:mm a")
      .replace(/^0/, "");
    times += '  -  ';
    times += moment(this.props.data.end.dateTime)
      .format("hh:mm a")
      .replace(/^0/, "");

    let className = 'calendar__entry';
    if (this.props.popover)
      className += ' shadow';

    if ( moment(this.props.data.end.dateTime).isBefore(new moment())){
        className += ' happened-already';
      }

    let startHour = moment(this.props.data.start.dateTime).hour();
    let timeLink = "#" + "row-" + startHour;

    let content = (
      <li className={className} style={{
        height: this.props.data.layout.height + '%',
        top: this.props.data.layout.top + '%',
        width: (this.props.data.layout.width - 0.5) + '%',
        left: this.props.data.layout.left + '%'
      }} onClick={this.props.setPopover}
      tabIndex="-1"
      id = { this.props.id }
      >
        <div style={{
          backgroundColor: taskColor,
          color: taskTextColor
        }}>{times}</div>
        <div>
          <h5>
            {this.props.data.summary}
          </h5>
          <button onClick = { this.props.setAccessibilityEntry } className="sr-only">
          go to hourly weather information, starting from { startHour }, the hour
          when this event begins
          </button>
        </div>
      </li>
    );

    let popoverBody = (
      <div>
        <button className="Popover__button" onClick={ this.props.setPopover }>
          <i className="fa fa-lg fa-times"/>
        </button>
        <p>{this.props.data.summary}</p>
        <a href={this.props.data.htmlLink} target='_blank' className="Popover__edit-link">
          <i className='fa fa-pencil-square-o'></i>
          edit
        </a>
      </div>
    );

    return (
      <Popover isOpen={this.props.popover} body={popoverBody}>
        {content}
      </Popover>
    );

  }

}

CalendarEntryComponent.displayName = 'CalendarEntryComponent';

CalendarEntryComponent.propTypes = {
  data: React.PropTypes.object.isRequired,
  setPopover: React.PropTypes.func.isRequired,
  popover: React.PropTypes.bool.isRequired,
};
// CalendarEntryComponent.defaultProps = {};

export default CalendarEntryComponent;
