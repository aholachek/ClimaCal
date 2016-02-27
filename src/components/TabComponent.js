'use strict';

import React from 'react';

class TabComponent extends React.Component {
  render() {

    let that = this;

    let tabs = this.props.tabs.map(function(t) {
      let c = that.props.active === t.title ? "active tab-component__tab " : "tab-component__tab";
      let icon = "wi wi-forecast-io-" + t.weather.icon;
      let weatherIconSmall = "weather-icon-small " + icon;
      let weatherIconLarge = "weather-icon-large " + icon;
      return (
              <li className={c} key={t.title}>
                <a href="#" onClick={t.onTabChange}>
                  <h3 className="tab__title"> <i className={weatherIconSmall}/> {t.title} <span className="tab__temp">{parseInt(t.weather.apparentTemperatureMin)}&deg;-{parseInt(t.weather.apparentTemperatureMax)}&deg;</span></h3>
                </a>
              </li>
            )
    });

    return (
      <div className="tab-component">
        <ul>
          {tabs}
        </ul>
      </div>
    );
  }
}

TabComponent.displayName = 'TabComponent';

// Uncomment properties you need
// TabComponent.propTypes = {};
// TabComponent.defaultProps = {};

export default TabComponent;
