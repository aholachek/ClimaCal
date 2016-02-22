'use strict';

import React from 'react';
import ReactDOM from 'react-dom'
import d3 from 'd3';
import _ from 'lodash';
import Popover from 'react-popover';

class CalendarHourComponent extends React.Component {

  render() {

    let time = new Date(this.props.data.time * 1000);
    let hour = time.getHours();

    if (hour === 0)
      hour = '12a'
    else if (hour == 12)
      hour = '12pm'
    else if (hour > 12)
      hour = hour - 12 + 'pm'
    else
      hour = hour + 'am';

    var iconClass = 'wi wi-forecast-io-' + this.props.data.icon;

    let probabilityThreshold = .1;
    let precip = (<div className = 'precip-anim-container'>
          <svg></svg>
          --
        </div>);

    if (this.props.data.precipProbability > probabilityThreshold) {
     precip = (
        <div className = 'precip-anim-container'>
          <svg ref='precipContainer' ></svg>
          {(this.props.data.precipProbability * 100).toFixed()+ '%'}
        </div>
      );
    }

    let displayTemp = parseInt(this.props.data.apparentTemperature);
    let tempClass = 'temp';

    let parentClass = 'calendar__hour';
    if (time > this.props.sun[0] && time < this.props.sun[1]){
      parentClass += ' calendar__hour--day';
    }

    let weather = (
      <div className='calendar__hour__weather' onClick={this.props.setPopover}>
      <div className = {tempClass}>{displayTemp}&deg;</div>
      <div>
        <i className={iconClass}></i>
      </div>
      <div>
        {precip}
      </div>
    </div>
  );

    if (this.props.popover){

    let popoverBody = (
      <div>
        <h4>{hour} : {this.props.data.summary.toLowerCase()}</h4>
        <ul>
          <li>humidity: {this.props.data.humidity}/1</li>
          <li> real temp : {this.props.data.temperature.toFixed(0)}&deg;</li>
          <li> feels like : {this.props.data.apparentTemperature.toFixed(0)}&deg;</li>
        </ul>
      </div>
    )
     weather = (<Popover isOpen={true} body={popoverBody}>{weather}</Popover>);
    }

    return (
      <li className={parentClass}>
        <div>{hour.slice(0, hour.length - 1)}</div>
        <div></div>
        {weather}
      </li>
    );
  }

  addPrecipAnimation (){
    const precipContainer = ReactDOM.findDOMNode(this.refs.precipContainer);
    if (!precipContainer)
      return;

    const precipCountScale = d3.scale.linear()
    //0 --- .4 (heavy rain)
      .domain([0, .4]).rangeRound([1, 15]).clamp(true);

    const svg = d3.select(ReactDOM.findDOMNode(this.refs.precipContainer));
    const d = this.props.data;
    const numCircles = precipCountScale(d.precipIntensity);

    svg.selectAll('circle')
    .data(_.range(numCircles))
    .enter()
    .append('circle')
    .attr('fill', function() {
        if (d.precipType === 'snow' || d.precipType === 'sleet' || d.precipType === 'hail') {return 'snow';} else {return '#5151E6'}
      }).attr('stroke', function() {
        if (d.precipType === 'snow' || d.precipType === 'sleet' || d.precipType === 'hail') {return 'black';} else {return '#5151E6'}
      }).each(function() {
        setTimeout(function() {
          var speed = d.precipIntensity > .2
            ? 'fast'
            : 'slow';
          if (d.precipType === 'snow' || d.precipType === 'sleet' || d.precipType === 'hail') {
            d3.select(this).classed('snow--' + speed, true);
          } else {d3.select(this).classed('rain--' + speed, true);}
        }.bind(this), Math.random() * 4000);
      })
      .attr('r', function() {
        return 2.3;
      })
      .attr('cx', function() {
          return d3.max([2, Math.random() * 30]);
      })
      .style('fill-opacity', .4)
      .style('stroke-opacity', .7);
  }

  componentDidMount () {
    this.addPrecipAnimation.call(this);
  }

  componentDidUpdate (){
    this.addPrecipAnimation.call(this);
  }

}

CalendarHourComponent.displayName = 'CalendarHourComponent';

// Uncomment properties you need
CalendarHourComponent.propTypes = {
  data: React.PropTypes.object
};
// CalendarHourComponent.defaultProps = {};

export default CalendarHourComponent;
