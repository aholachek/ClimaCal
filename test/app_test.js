/*eslint-env node, mocha */
/*global expect */
'use strict';

// Uncomment the following lines to use the react test utilities
import React from 'react/addons';
const TestUtils = React.addons.TestUtils;

import AppStateManager from './../src/modules/data_store.js';
import DefaultAppState from './../src/modules/default_app_state.js';
import App from './../src/components/Main.js';


describe('AppStateManager', () => {

  afterEach(()=> {
    let app = document.querySelector("#app");
    if (app)   document.body.removeChild(app)
  })

    it('should have a setState and getState method', () => {
      expect(AppStateManager.setState).to.be.instanceof(Function);
      expect(AppStateManager.getState).to.be.instanceof(Function);
    });

    it('should by default populate with the default_app_state ', () => {
      AppStateManager.init();
      expect(JSON.stringify(AppStateManager.getState())).to.eql(JSON.stringify(DefaultAppState));
    });


    it('should compute properties every time app state is set', () => {

      expect(AppStateManager.getState().onboardModal).to.be.true;

      let state = AppStateManager.getState();
      state.auth = 'self';
      state.self.calendar = true;
      state.self.weather = true;
      AppStateManager.setState(state);

      expect(AppStateManager.getState().onboardModal).to.be.false;

    });

    it('should render the app each time the data changes ', (done) => {
      let appContainer = document.createElement("div")
      appContainer.id = "app";
      document.body.appendChild(appContainer);
      AppStateManager.init(App);

      //by default the app should show loading viewing
      expect(document.querySelector(".overlay-details").textContent).to.eql(" loading ClimaCal... ");
      let state = AppStateManager.getState();
      state.self.googleAuth = false;
      AppStateManager.setState(state);

      // //once it checks and see google authentication isn't there yet, offer the two options
      expect(document.querySelector(".overlay-details").textContent).to.eql("ClimaCal load my calendar + local weather data   or  view a preview of the app");

      //set a loading error
      state = AppStateManager.getState();
      state.error = "failed loading data";
      AppStateManager.setState(state);

      expect(document.querySelector(".overlay-details").textContent).to.eql("ClimaCalfailed loading dataTry just checking out the app preview for now load my calendar + local weather data   or  view a preview of the app");

      //click "preview app" should remove error state and show preview
      TestUtils.Simulate.click(document.querySelector("#preview-app-button"));

      expect(AppStateManager.getState().error).to.eql(false);

      setTimeout(function(){
        //onboard modal has been removed
        expect(document.querySelector(".overlay-details")).to.be.null;
        done();

      }, 600)


    });

    it('should show the appropriate tab (today or tomorrow) when tab is clicked', (done) => {

      let appContainer = document.createElement("div")
      appContainer.id = "app";
      document.body.appendChild(appContainer);
      AppStateManager.init(App);

      let state = AppStateManager.getState();
      state.onboardModal = false;
      AppStateManager.setState(state);

      setTimeout(function(){

        expect(document.querySelector(".calendar__entry:first-of-type").textContent).to.eql("8:30am - 9:00ambreakfast meeting");
        TestUtils.Simulate.click(document.querySelector(".tab-component__tab:nth-of-type(2) a"));
        expect(document.querySelector(".calendar__entry:first-of-type").textContent).to.eql("8:00am - 7:00pmall day cat convention");

        done();

      }, 600);


    })

});
