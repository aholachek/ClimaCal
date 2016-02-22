
import 'core-js/fn/object/assign';
import App from './Main';
import Calendar from './../modules/calendar';
import AppStateManager from './../modules/data_store';
import DefaultState from './../modules/default_app_state';

AppStateManager.App = App;

//add google calendar script to head
Calendar.init();

AppStateManager.setState(DefaultState);
