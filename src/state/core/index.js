import { combineReducers } from '@reduxjs/toolkit';
import usCovidData from './usCovidData.js';
import time from './time.js';

export default combineReducers({
  usCovidData,
  time,
});
