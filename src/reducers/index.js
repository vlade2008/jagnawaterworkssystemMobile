import { combineReducers } from 'redux';
import auth from './auth'
import nav from './nav'
import consumers from './consumers'
import readings from './readings'
import bill from './bill'

const AppReducer = combineReducers({
  nav,
  auth,
  consumers,
  readings,
  bill
});

export default AppReducer;
