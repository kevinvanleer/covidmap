import { tick } from '../state/core/time.js';

const updateCurrentTime = (timestamp, previous) => (dispatch, getState) => {
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
};

export const start = () => (dispatch) =>
  window.requestAnimationFrame((timestamp) =>
    dispatch(updateCurrentTime(timestamp))
  );
