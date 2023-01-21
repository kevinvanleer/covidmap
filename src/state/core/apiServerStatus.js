import { createSlice } from '@reduxjs/toolkit';

const apiServerStatusSlice = createSlice({
  name: 'apiServerStatus',
  initialState: {
    aliveCheck: {
      pending: null,
      error: null,
      complete: null,
      success: null,
      result: null,
      object: null,
    },
  },
  reducers: {
    aliveCheckPending: (state) => {
      state.aliveCheck = {
        pending: true,
        error: null,
        complete: false,
        success: null,
        result: null,
        object: null,
      };
    },
    aliveCheckPassed: (state, action) => {
      state.aliveCheck = {
        pending: false,
        error: false,
        complete: true,
        success: true,
        result: action.payload,
        object: null,
      };
    },
    aliveCheckFailed: (state, action) => {
      state.aliveCheck = {
        pending: false,
        error: true,
        complete: true,
        success: false,
        result: action.payload,
        object: null,
      };
    },
  },
});

export const { aliveCheckPending, aliveCheckPassed, aliveCheckFailed } =
  apiServerStatusSlice.actions;
export default apiServerStatusSlice.reducer;
