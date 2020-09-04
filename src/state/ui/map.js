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
    layerGroups: layerGroups['us'],
    layers: layers,
    selectedLayerGroup: layerGroups['us'][0],
    views: Object.keys(layerGroups).map((key) => ({ name: key })),
    activeView: { name: 'us' },
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
    setActiveView: (state, action) => {
      state.activeView = action.payload;
      if (action.payload.name.toLowerCase() === 'world') {
        state.map.setMinZoom(0);
        state.map.flyTo({
          center: [10, 25],
          zoom: 1.7,
        });
      } else {
        state.map.flyTo({
          center: [-95, 39],
          zoom: 4,
        });
        state.map.setMinZoom(3);
      }
      state.layerGroups = layerGroups[action.payload.name];
      state.selectedLayerGroup = layerGroups[action.payload.name][0];
      state.hold = false;
      state.selectedFeature = null;
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
  setActiveView,
  updateActiveLayers,
} = mapSlice.actions;
export default mapSlice.reducer;
