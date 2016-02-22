'use strict';

import React from 'react';
import Popover from 'react-popover';
import Colors from './../config/colors';

//utility classes for date presentation
function getDisplayHours(hours) {
  if (hours == 0) {
    return "" + 12;
  } else if (hours <= 12) {
    return "" + hours
  } else {
    return "" + (hours - 12);
  }
}

function getDisplayMinutes(m) {
  if (m > 9) return m;
  return m + "0";
}

function getDisplayTime(date) {
  var hours = getDisplayHours(date.getHours());
  var minutes = getDisplayMinutes(date.getMinutes());
  var ending = date.getHours() < 12 ? "am" : "pm";
  return hours + ":" + minutes + ending;
}

class CalendarEntryComponent extends React.Component {


  render() {

    let taskColor = this.props.data.colorId ? Colors.event[this.props.data.colorId].background : "gray";
    let taskTextColor = this.props.data.colorId ? Colors.event[this.props.data.colorId].foreground : "#212121";

    let times = getDisplayTime(new Date(this.props.data.start.dateTime));
        times+= " - ";
        times+= getDisplayTime(new Date(this.props.data.end.dateTime));

    let content = (
      <li className="calendar__entry" style={{
          height : this.props.data.layout.height  + "%",
          top : this.props.data.layout.top  + "%",
          width : (this.props.data.layout.width - 0.5) + "%",
          left: this.props.data.layout.left + "%"

        }}
        onClick={this.props.setPopover}>
        <div style={{backgroundColor : taskColor, color : taskTextColor }}>{times}</div>
        <div>
          {this.props.data.summary}
        </div>
      </li>
    );

    if (this.props.popover){
      let body = (<div>
        <a href={this.props.data.htmlLink} target="_blank"><i className="fa fa-pencil-square-o"></i> edit</a>
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

// Uncomment properties you need
CalendarEntryComponent.propTypes = {
  data : React.PropTypes.object
};
// CalendarEntryComponent.defaultProps = {};

export default CalendarEntryComponent;
