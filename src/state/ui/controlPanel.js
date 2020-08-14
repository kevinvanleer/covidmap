import { createSlice } from '@reduxjs/toolkit';

const controlPanelSlice = createSlice({
  name: 'controlPanel',
  initialState: {
    layersHidden: false,
    detailsHidden: false,
    collapsed: false,
  },
  reducers: {
    collapse: (state, action) => {
      state.collapsed = action.payload;
    },
    expand: (state) => {
      state.collapsed = false;
    },
    showLayers: (state) => {
      state.layersHidden = false;
    },
    hideLayers: (state, action) => {
      state.layersHidden = action.payload;
    },
    showDetails: (state) => {
      state.detailsHidden = false;
    },
    hideDetails: (state, action) => {
      state.detailsHidden = action.payload;
    },
  },
});

export const {
  collapse,
  expand,
  hideLayers,
  showLayers,
  hideDetails,
  showDetails,
} = controlPanelSlice.actions;
export default controlPanelSlice.reducer;
