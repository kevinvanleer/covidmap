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
  },
  reducers: {
    requestPending: (state) => {
      state.pending = true;
      state.error = null;
      state.complete = false;
      state.success = null;
      state.result = null;
      state.object = null;
    },
    requestSucceeded: (state, action) => {
      state.pending = false;
      state.error = false;
      state.complete = true;
      state.success = true;
      state.result = action.payload;
      state.object = null;
    },
    requestFailed: (state, action) => {
      state.pending = false;
      state.error = true;
      state.complete = true;
      state.success = false;
      state.result = action.payload;
      state.object = null;
    },
  },
});

export const {
  requestPending,
  requestSucceeded,
  requestFailed,
} = usCasesByCountySlice.actions;

export default usCasesByCountySlice.reducer;
