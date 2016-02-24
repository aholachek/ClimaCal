'use strict';
import React from 'react';
import Colors from '../config/colors';
import Popover from 'react-popover';


class AllDayTaskComponent extends React.Component {

  render() {
  let color = Colors.event[this.props.data.colorId].background || "gray";

  let content = (<li  onClick = {this.props.setPopover}
                      style = {{borderBottom : ".35rem solid " + color}}>
                      {this.props.data.summary}
                </li>);

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

AllDayTaskComponent.displayName = 'AllDayTaskComponent';

AllDayTaskComponent.propTypes = {
  data : React.PropTypes.object.isRequired,
  setPopover : React.PropTypes.func.isRequired,
  popover : React.PropTypes.bool.isRequired
};

export default AllDayTaskComponent;
