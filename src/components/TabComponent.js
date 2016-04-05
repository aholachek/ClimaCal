'use strict';

import React from 'react';

class TabComponent extends React.Component {
  render() {

    let that = this;

    let tabs = this.props.tabs.map(function(t) {

      let c = that.props.active === t.title ? "active tab-component__tab " : "tab-component__tab";
      let weatherIconSmall = "weather-icon-small wi wi-forecast-io-" + t.weather.icon;

      return (
              <li className={c} key={t.title}>
                <a href={"/#/" + t.title.replace(/\s/g, "-")} onClick={t.onTabChange}>
                  <h3 className="tab__title"> <span className="icon-container">
                    <i className={weatherIconSmall}/></span>&nbsp;
                      <span className="tab__title__label">{t.title}</span>&nbsp;
                      <span className="tab__title__temp small-invisible">{Math.floor(t.weather.apparentTemperatureMin)}&deg;-{Math.floor(t.weather.apparentTemperatureMax)}&deg;</span>
                      </h3>
                </a>
              </li>
            );
    });

    return (
      <nav className="tab-component">
        <ul>
          {tabs}
        </ul>
      </nav>
    );
  }
}

TabComponent.displayName = 'TabComponent';

// Uncomment properties you need
// TabComponent.propTypes = {};
// TabComponent.defaultProps = {};

export default TabComponent;
