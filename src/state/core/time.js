import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import moment from 'moment';

const updateCurrentTime = createAsyncThunk(
  'time/updateCurrentTime',
  ({ timestamp, previous }, { dispatch, getState }) => {
    const state = getState();
    const time = state.core.time;
    let delay = 100;
    if (!time.pause) {
      delay = 0;
      if (!previous) {
        previous = timestamp;
      }
      dispatch(tick(timestamp - previous));
    }

    window.requestAnimationFrame((next) =>
      setTimeout(() => dispatch(updateCurrentTime(next, timestamp)), delay)
    );
  }
);

export const start = createAsyncThunk('time/startPlayback', ({ dispatch }) =>
  window.requestAnimationFrame((timestamp) =>
    dispatch(updateCurrentTime(timestamp))
  )
);

const timeSlice = createSlice({
  name: 'time',
  initialState: {
    min: parseInt(moment('2020-01-01').format('x')),
    max: parseInt(moment().subtract(1, 'days').format('x')),
    current: parseInt(moment().subtract(1, 'days').format('x')),
    duration: null,
    pause: true,
    rate: 0,
  },
  reducers: {
    setCurrent: (state, action) => {
      state.current = parseInt(action.payload);
    },
    tick: (state, action) => {
      let newTime;
      if (state.current >= state.max) {
        newTime = state.min;
      } else {
        newTime = state.current + action.payload * state.rate;
        if (newTime > state.max) {
          newTime = state.max;
        }
      }
      state.current = newTime;
    },
    togglePlayPause: (state) => {
      state.pause = !state.pause;
      state.rate = state.pause ? 0 : 864000;
    },
    setMax: (state, action) => {
      state.max = action.payload;
    },
    setMin: (state, action) => {
      state.min = action.payload;
    },
    setRate: (state, action) => {
      state.rate = action.payload;
    },
    setPause: (state, action) => {
      state.pause = action.pause;
    },
    setDuration: (state, action) => {
      state.duration = action.payload;
    },
    setTimeRange: (state, action) => {
      state.max = parseInt(moment(action.payload.end).format('x'));
      state.min = parseInt(moment(action.payload.start).format('x'));
      if (state.current > state.max) {
        state.current = state.max;
      }
      if (state.current < state.min) {
        state.current = state.min;
      }
    },
  },
});

export const {
  setCurrent,
  tick,
  setMax,
  setMin,
  setTimeRange,
  setRate,
  setPause,
  setDuration,
  togglePlayPause,
} = timeSlice.actions;
export default timeSlice.reducer;
