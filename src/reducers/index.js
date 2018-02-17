import { combineReducers } from 'redux';
import auth from './auth'
import nav from './nav'
import consumers from './consumers'
import readings from './readings'


const AppReducer = combineReducers({
  nav,
  auth,
  consumers,
  readings
});

export default AppReducer;
