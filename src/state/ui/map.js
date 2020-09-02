import { createSlice } from '@reduxjs/toolkit';
import { loadingStatus, loadStatusDefaults } from '../util/loadingStatus.js';
import { layerGroups, layers } from '../../mapboxConfig.js';

const mapSlice = createSlice({
  name: 'map',
  initialState: {
    hold: false,
    selectedFeature: null,
    mapLoadStatus: { ...loadStatusDefaults },
    sourcesLoadStatus: { ...loadStatusDefaults },
    layersLoadStatus: { ...loadStatusDefaults },
    map: null,
    layerGroups: layerGroups,
    layers: layers,
    selectedLayerGroup: layerGroups[0],
    hoveredFeatures: [],
    activeLayers: layers
      .filter(
        (layer) => !layer?.legend?.mutex && !layer?.legend?.defaultDisabled
      )
      .map((layer) => layer.id),
  },
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
    beginMapInitialization: (state) => {
      state.mapLoadStatus.status = loadingStatus.pending;
      state.sourcesLoadStatus.status = loadingStatus.pending;
      state.layersLoadStatus.status = loadingStatus.pending;
    },
    beginLoadingMap: (state, action) => {
      state.map = action.payload;
      state.mapLoadStatus.status = loadingStatus.loading;
    },
    mapFinishedLoading: (state) => {
      state.mapLoadStatus.status = loadingStatus.complete;
    },
    beginLoadingSources: (state) => {
      state.sourcesLoadStatus.status = loadingStatus.loading;
    },
    sourcesFinishedLoading: (state) => {
      state.sourcesLoadStatus.status = loadingStatus.complete;
    },
    beginLoadingLayers: (state) => {
      state.layersLoadStatus.status = loadingStatus.loading;
    },
    layersFinishedLoading: (state) => {
      state.layersLoadStatus.status = loadingStatus.complete;
    },
    selectLayerGroup: (state, action) => {
      state.selectedLayerGroup = action.payload;
    },
    setHoveredFeatures: (state, action) => {
      state.hoveredFeatures = action.payload;
    },
    setActiveLayers: (state, action) => {
      state.activeLayers = action.payload;
    },
    updateActiveLayers: (state, action) => {
      const layerId = action.payload;
      const currentState = state.activeLayers.includes(layerId);
      state.activeLayers = currentState
        ? state.activeLayers.filter((item) => item !== layerId)
        : [...state.activeLayers, layerId];
    },
  },
});

export const {
  setHold,
  hold,
  releaseHold,
  setSelectedFeature,
  beginMapInitialization,
  beginLoadingMap,
  mapFinishedLoading,
  beginLoadingSources,
  sourcesFinishedLoading,
  beingLoadingLayers,
  layersFinishedLoading,
  selectLayerGroup,
  setHoveredFeatures,
  setActiveLayers,
  updateActiveLayers,
} = mapSlice.actions;
export default mapSlice.reducer;
