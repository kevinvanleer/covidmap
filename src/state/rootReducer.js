import { combineReducers } from '@reduxjs/toolkit';
import core from './core';
import ui from './ui';
import request from './request';

export default combineReducers({
  core,
  ui,
  request,
});
