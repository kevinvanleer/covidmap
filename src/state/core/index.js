import { combineReducers } from '@reduxjs/toolkit';
import usCovidData from './usCovidData.js';
import time from './time.js';
import apiServerStatus from './apiServerStatus.js';

export default combineReducers({
  usCovidData,
  time,
  apiServerStatus,
});
