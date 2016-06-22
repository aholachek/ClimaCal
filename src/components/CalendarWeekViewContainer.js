'use strict';

import React from 'react';
import DayView from './CalendarWeekViewDay';

import { Scrollbars } from 'react-custom-scrollbars';

import { VelocityTransitionGroup } from 'velocity-react';
import Velocity from 'velocity-animate';
import VelocityUI from 'velocity-animate/velocity.ui';

class CalendarWeekViewContainerComponent extends React.Component {

  render() {
    var that = this;
    var days = this.props.scheduleData.data.map(function(c){
      return (
          <DayView {...c}
            popover={that.props.popover}
            setPopover= {that.props.setPopover}
            key= {c.day.format()}
            >
            ></DayView>
    );
    });

    return (
      <VelocityTransitionGroup
        component='div'
        className="calendar-week__container"
        enter={{
          animation: 'transition.fadeIn'
        }}
        runOnMount
        >
        <div className="calendar-week__summary">
          {this.props.scheduleData.summary}
        </div>
        <Scrollbars autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={200} >
        <VelocityTransitionGroup
          component="ol"
          enter={{
            animation: "transition.slideDownIn",
            stagger: "70ms"
          }}
          className="calendar-week"
          runOnMount>
              {days}
        </VelocityTransitionGroup>
      </Scrollbars>
    </VelocityTransitionGroup>

    );
  }
}

CalendarWeekViewContainerComponent.displayName = 'CalendarWeekViewContainerComponent';

 CalendarWeekViewContainerComponent.propTypes = {
  scheduleData: React.PropTypes.object.isRequired,
  today: React.PropTypes.object.isRequired,
  popover: React.PropTypes.string,
  setPopover: React.PropTypes.func.isRequired,
};


export default CalendarWeekViewContainerComponent;
