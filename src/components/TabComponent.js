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
              <li className={c}>
                <a href="#" onClick={t.onTabChange}>
                  <i className={weatherIconLarge}/>
                  <div className="tab__date">{t.dateString}</div>
                  <h3 className="tab__title"> {t.title}</h3>
                  <div> <i className={weatherIconSmall}/> {parseInt(t.weather.apparentTemperatureMin)}&deg;  {parseInt(t.weather.apparentTemperatureMax)}&deg;</div>
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
