'use strict';
import React from 'react';
import Colors from '../config/colors';

class AllDayTaskComponent extends React.Component {

  render() {
    var color = Colors.event[this.props.data.colorId].background || "gray";
  return <li style = {{borderBottom : ".35rem solid " + color}}>{this.props.data.summary}</li>
}

}

AllDayTaskComponent.displayName = 'AllDayTaskComponent';

// Uncomment properties you need
// AuthButtonComponent.propTypes = {};
// AuthButtonComponent.defaultProps = {};

export default AllDayTaskComponent;
