import { combineReducers } from '@reduxjs/toolkit';
import covidByCounty from './covidByCounty.js';

export default combineReducers({
  covidByCounty,
});
