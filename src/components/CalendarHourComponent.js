'use strict';

import React from 'react';
import ReactDOM from 'react-dom'
import d3 from 'd3';
import _ from 'lodash';
import Popover from 'react-popover';
import Velocity from 'velocity-animate';

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
          -
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
          <li> real temp : {this.props.data.temperature.toFixed(0)}&deg;</li>
          <li> feels like : {this.props.data.apparentTemperature.toFixed(0)}&deg;</li>
          <li> humidity: {this.props.data.humidity * 100}% </li>
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
    const precipCountScale = d3.scale.linear()
    //0 --- .4 (heavy rain)
      .domain([0, .4]).rangeRound([8, 20]).clamp(true);

    const svg = ReactDOM.findDOMNode(this.refs.precipContainer);
    const d = this.props.data;

    let circle = d3.select(svg).selectAll('circle')
    .data(_.range(precipCountScale(d.precipIntensity)))
    .enter()
    .append('circle')
    .attr('fill', function() {
        if (d.precipType === 'snow' || d.precipType === 'sleet' || d.precipType === 'hail')
        {return 'snow' }
         else
         {return '#5151E6'}
      })
      .each(function(){
        this.multiplier = Math.random();
      })
      .attr('r', function(d) {
        return this.multiplier * 3;
      })

      .each(function(){

        let that = this;
        that.setAttribute('fill-opacity', (that.multiplier * .6).toFixed(1));

          function animate() {

            that.setAttribute('cx', d3.max([2, Math.random() * 40]));
            that.setAttribute('cy', d3.max([2, Math.random() * 30]));

              Velocity(that, {
                translateY : ['50px', '-10px'],

              }, {
                delay : Math.random() * 5000,
                duration : 3000,
                complete : animate
              });
          }

          animate();

        });

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
