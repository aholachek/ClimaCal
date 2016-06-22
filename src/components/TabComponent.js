'use strict';

import React from 'react';
import { Link } from 'react-router';

class TabComponent extends React.Component {
  render() {

    let that = this;
    let tabs = this.props.tabs.map(function(t) {
      let c = that.props.active === t.title.replace(" ", "-") ? "active tab-component__tab " : "tab-component__tab";
      let weatherIconSmall = "weather-icon-small wi wi-forecast-io-" + t.weather.icon + " large-inline";

      return (
              <li className={c} key={t.title}>
                <Link to={"/" + t.title.replace(/\s/g, "-")} aria-label={that.props.active === t.title ? "current page" : ""}>
                  <h3 className="tab__title"> <span className="icon-container">
                    <i className={weatherIconSmall} aria-label={t.weather.summary}/></span>&nbsp;
                      <span className="tab__title__label">{t.title}</span>&nbsp;
                      <span className="tab__title__temp small-invisible">{Math.floor(t.weather.apparentTemperatureMin)}&deg;-{Math.floor(t.weather.apparentTemperatureMax)}&deg;</span>
                      </h3>
                </Link>
              </li>
            );
    });

    return (
      <div className="tab-component">
        <h2 className="sr-only">Pick a view of your calendar</h2>
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
