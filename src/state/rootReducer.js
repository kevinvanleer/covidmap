import { combineReducers } from '@reduxjs/toolkit';
import core from './core';
import ui from './ui';

export default combineReducers({
  core,
  ui,
});
