
import 'core-js/fn/object/assign';
import App from './Main';
import Calendar from './../modules/calendar';
import AppStateManager from './../modules/data_store';


//add google calendar script to head
Calendar.init();

AppStateManager.init(App);
