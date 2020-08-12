import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
  name: 'map',
  initialState: { hold: false, selectedFeature: null },
  reducers: {
    hold: (state) => {
      state.hold = true;
    },
    releaseHold: (state) => {
      state.hold = false;
    },
    setHold: (state, action) => {
      state.hold = action.payload;
    },
    setSelectedFeature: (state, action) => {
      state.selectedFeature = action.payload;
    },
  },
});

export const {
  setHold,
  hold,
  releaseHold,
  setSelectedFeature,
} = mapSlice.actions;
export default mapSlice.reducer;
