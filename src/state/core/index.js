import { combineReducers } from '@reduxjs/toolkit';
import covidByCounty from './covidByCounty.js';
import time from './time.js';

export default combineReducers({
  covidByCounty,
  time,
});
