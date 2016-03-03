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

    let times = moment(this.props.data.start.dateTime).format("HH:mm a");
        times+= '  -  ';
        times+= moment(this.props.data.end.dateTime).format("HH:mm a");

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
