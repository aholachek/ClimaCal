

import ReactDOM from 'react-dom';
import React from 'react';

import Weather from './weather';

//singleton in charge of keeping state + rendering app with that state
const AppStateManager = {

    data : {},

    setState : function(data){
      this.data = _.extend(this.data, data);

      this.processData();

      if (this.App){
        ReactDOM.render(<this.App data={this.data}/>, document.getElementById('app'));
      }
      else {
        console.error("no app provided")
      }
    },

    //make any computed changes here
    processData : function(){
      if (this.data.auth === 'self' && this.data.self.calendar && this.data.self.weather){
        //if first two are true, will show loading view
        this.data.onboardModal = false;
      }

      if (this.data.auth === 'self' && this.data.self.calendar && !this.data.self.weather){
        //automatically request weather
        Weather.getWeatherData();

      }

    },

    getState : function(){
      return JSON.parse(JSON.stringify(this.data))
    }

}


export default AppStateManager;
