'use strict';

import React from 'react';
import Popover from 'react-popover';
import Colors from './../config/colors';

//utility classes for date presentation
function getDisplayHours(hours) {
  if (hours == 0) {
    return '' + 12;
  } else if (hours <= 12) {
    return '' + hours
  } else {
    return '' + (hours - 12);
  }
}

function getDisplayMinutes(m) {
  if (m > 9) return m;
  return m + '0';
}

function getDisplayTime(date) {
  var hours = getDisplayHours(date.getHours());
  var minutes = getDisplayMinutes(date.getMinutes());
  var ending = date.getHours() < 12 ? 'am' : 'pm';
  return hours + ':' + minutes + ending;
}

class CalendarEntryComponent extends React.Component {


  render() {

    let colorId = this.props.data.colorId || '9';

    let taskColor = Colors.event[colorId].background
    let taskTextColor = Colors.event[colorId].foreground;

    let times = getDisplayTime(new Date(this.props.data.start.dateTime));
        times+= ' - ';
        times+= getDisplayTime(new Date(this.props.data.end.dateTime));

    let className = 'calendar__entry';
    if (this.props.popover) className += ' shadow'

    let content = (
      <li className={className} style={{
          height : this.props.data.layout.height  + '%',
          top : this.props.data.layout.top  + '%',
          width : (this.props.data.layout.width - 0.5) + '%',
          left: this.props.data.layout.left + '%'
        }}
        onClick = {this.props.setPopover}

        >
        <div style={{backgroundColor : taskColor, color : taskTextColor }}>{times}</div>
        <div>
          {this.props.data.summary}
        </div>
      </li>
    );

    if (this.props.popover){
      let body = (<div>
        <a href={this.props.data.htmlLink} target='_blank'><i className='fa fa-pencil-square-o'></i> edit</a>
        <p>{this.props.data.summary}</p>
      </div>)
      return (
        <Popover isOpen={true} body={body}>{content}</Popover>
      )
    }
    else {
      return content
    }
  }


}

CalendarEntryComponent.displayName = 'CalendarEntryComponent';

CalendarEntryComponent.propTypes = {
  data : React.PropTypes.object.isRequired,
  setPopover : React.PropTypes.func.isRequired,
  popover : React.PropTypes.bool.isRequired
};
// CalendarEntryComponent.defaultProps = {};

export default CalendarEntryComponent;
