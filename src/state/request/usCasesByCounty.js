import { createSlice } from '@reduxjs/toolkit';

const usCasesByCountySlice = createSlice({
  name: 'usCasesByCounty',
  initialState: {
    pending: null,
    error: null,
    complete: null,
    success: null,
    result: null,
    object: null,
    progress: null,
  },
  reducers: {
    requestPending: (state, action) => {
      state.pending = true;
      state.error = null;
      state.complete = false;
      state.success = null;
      state.result = null;
      state.object = null;
      state.progress = action.payload || 0;
    },
    requestSucceeded: (state, action) => {
      state.pending = false;
      state.error = false;
      state.complete = true;
      state.success = true;
      state.result = action.payload;
      state.object = null;
      state.progress = 1;
    },
    requestFailed: (state, action) => {
      state.pending = false;
      state.error = true;
      state.complete = true;
      state.success = false;
      state.result = action.payload;
      state.object = null;
      state.progress = null;
    },
  },
});

export const { requestPending, requestSucceeded, requestFailed } =
  usCasesByCountySlice.actions;

export default usCasesByCountySlice.reducer;
