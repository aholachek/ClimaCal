'use strict';
import React from 'react';
import Colors from '../config/colors';
import Popover from 'react-popover';


class AllDayTaskComponent extends React.Component {

  render() {
  let color = Colors.event[this.props.data.colorId].background || "gray";

  let className = '';
  if (this.props.popover) className += ' shadow';

  let style = {};
  style[this.props.borderSide ? this.props.borderSide : "borderTop"] = ".4rem solid " + color;

  let content = (<li
                      className={className}
                      onClick = {this.props.setPopover}
                      style = {style}>
                      <h5>{this.props.data.summary}</h5>
                </li>);

  if (this.props.popover){
    let body = (
      <div>
        <button className="Popover__button" onClick={ this.props.setPopover }>
          <i className="fa fa-lg fa-times"/>
        </button>
      <p>{this.props.data.summary}</p>
      <div className="Popover__edit-link">
        <a href={this.props.data.htmlLink} target="_blank">
          <i className="fa fa-pencil-square-o"></i> edit</a>
      </div>
    </div>);
    return (
      <Popover isOpen={true} body={body}>{content}</Popover>
    )
  }
  else {
    return content;
  }

}

}

AllDayTaskComponent.displayName = 'AllDayTaskComponent';

AllDayTaskComponent.propTypes = {
  data : React.PropTypes.object.isRequired,
  setPopover : React.PropTypes.func.isRequired,
  popover: React.PropTypes.bool,
  borderSide : React.PropTypes.string
};

export default AllDayTaskComponent;
