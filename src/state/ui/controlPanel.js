import { createSlice } from '@reduxjs/toolkit';

let mql = window.matchMedia('(max-width: 600px)');

const controlPanelSlice = createSlice({
  name: 'controlPanel',
  initialState: {
    layersHidden: mql.matches,
    detailsHidden: mql.matches,
    collapsed: mql.matches,
    showAbout: false,
  },
  reducers: {
    collapse: (state, action) => {
      if (
        !action.payload &&
        state.collapsed &&
        state.layersHidden &&
        state.detailsHidden
      ) {
        state.layersHidden = false;
        state.detailsHidden = false;
      }
      state.collapsed = action.payload;
    },
    expand: (state) => {
      if (state.collapsed && state.layersHidden && state.detailsHidden) {
        state.layersHidden = false;
        state.detailsHidden = false;
      }
      state.collapsed = false;
    },
    showLayers: (state) => {
      state.layersHidden = false;
    },
    hideLayers: (state, action) => {
      if (action.payload && state.detailsHidden) {
        state.collapsed = true;
      }
      state.layersHidden = action.payload;
    },
    showDetails: (state) => {
      state.detailsHidden = false;
    },
    hideDetails: (state, action) => {
      if (action.payload && state.layersHidden) {
        state.collapsed = true;
      }
      state.detailsHidden = action.payload;
    },
    setShowAbout: (state, action) => {
      state.showAbout = action.payload;
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
  setShowAbout,
} = controlPanelSlice.actions;
export default controlPanelSlice.reducer;
