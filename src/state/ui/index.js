import { combineReducers } from '@reduxjs/toolkit';
import map from './map.js';
import controlPanel from './controlPanel.js';

export default combineReducers({
  map,
  controlPanel,
});
