'use strict';

import React from 'react';
import ReactDOM from 'react-dom'
import d3 from 'd3';
import _ from 'lodash';
import Popover from 'react-popover';
import Moment from 'moment';

class CalendarHourComponent extends React.Component {

  render() {

    let time = Moment.parseZone(this.props.data.time);
    let hour = time.format('hha').replace(/^0/, "");
    //for accessibility
    let idHref = "row-" + time.hour();

    var iconClass = 'wi wi-forecast-io-' + this.props.data.icon;

    let probabilityThreshold = .1;
    let precip = (<div className = 'precip-anim-container'>
          <svg></svg>
           <i className="weather-icon-small wi wi-sprinkle faded" aria-label="no precipitation predicted for this hour"></i>
        </div>);

    if (this.props.data.precipProbability > probabilityThreshold) {
     precip = (
        <div className = 'precip-anim-container' aria-label="percent probability of precipitation">
          <svg ref='precipContainer' ></svg>
          {(this.props.data.precipProbability * 100).toFixed()+ '%'}
        </div>
      );
    }

    let displayTemp = parseInt(this.props.data.apparentTemperature);

    let parentClass = 'calendar__hour';
    if (time.isAfter(this.props.sun[0]) && time.isBefore(this.props.sun[1])){
      parentClass += ' calendar__hour--day';
    }
    if ( time.add(1, 'h').isBefore(new Moment())){
      parentClass += ' happened-already';
    }

    let className = 'calendar__hour__weather';
    if (this.props.popover) className += ' shadow';

    let weather = (
      <div className={className}
           onClick = {this.props.setPopover}
           >
      <div className = "weather__temp"
           dangerouslySetInnerHTML={{__html: displayTemp + '&deg;'}} />
      <div className="weather__icon">
        <i className={iconClass} aria-label={this.props.data.summary}></i>
      </div>
      <div className="weather__precip">
        {precip}
      </div>
    </div>
  );

    if (this.props.popover){

    let popoverBody = (
      <div>
        <button className="Popover__button" onClick={ this.props.setPopover }>
          <i className="fa fa-lg fa-times"/>
        </button>
        <h4>{hour} : {this.props.data.summary.toLowerCase()}</h4>
        <ul>
          <li> real temp: <b>{parseInt(this.props.data.temperature)}</b>&deg;&nbsp;&nbsp;feels like: <b>{parseInt(this.props.data.apparentTemperature)}</b>&deg;</li>
          <li> chance of precipitation : <b>{(this.props.data.precipProbability* 100).toFixed(0)}%</b></li>
          <li> humidity: <b>{(this.props.data.humidity * 100).toFixed(0)}% </b></li>
        </ul>
      </div>
    )
     weather = (<Popover isOpen={true} body={popoverBody}>{weather}</Popover>);
    }

    let accessabilityButton = "";
    if ( this.props.hasAccessibilityLink ){
      accessabilityButton = <button className="sr-only" onClick={this.props.setAccessibilityEntry}>
        click here to jump back to the previously focused calendar task
      </button>
    }

    return (
      <li className={parentClass} id={idHref} tabIndex="-1" key={ this.props.data.time } aria-label={"hourly weather information for " + hour}>
      {accessabilityButton}
        <div>{hour.slice(0, hour.length - 1)}</div>
        <div></div>
        {weather}
      </li>
    );
  }

  addPrecipAnimation (){
    const precipCountScale = d3.scale.linear()
    //0 --- .4 (heavy rain)
      .domain([0, .4]).rangeRound([3, 16]).clamp(true);

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
         {return '#97BBFF'}
      })
      .attr('stroke', function() {
          if (d.precipType === 'snow' || d.precipType === 'sleet' || d.precipType === 'hail')
          {return 'gray' }
           else
           {return '#97BBFF'}
        })
      .attr('stroke-width', 1)
      .each(function(){
        this.multiplier = Math.random();
      })
      .attr('r', function(d) {
        return this.multiplier * 3;
      })
      .each(function(){

          let animate = function () {

            //it's not in the DOM anymore, so stop
            if (!document.body.contains(this)) {
                return
            }

              this.setAttribute('cx', d3.max([4, Math.random() * 40]));
              this.setAttribute('cy', d3.max([2, Math.random() * 30]));
              var delay = Math.random() * 5000;

              var addList = function(){
                this.classList.add("fall-down");
              }.bind(this);

              setTimeout(addList, delay);

            }.bind(this)
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

CalendarHourComponent.propTypes = {
  data : React.PropTypes.object.isRequired,
  setPopover : React.PropTypes.func.isRequired,
  popover: React.PropTypes.bool.isRequired,
  sun : React.PropTypes.array.isRequired
};
// CalendarHourComponent.defaultProps = {};

export default CalendarHourComponent;
