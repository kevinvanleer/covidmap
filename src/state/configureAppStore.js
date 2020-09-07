import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import monitorReducersEnhancer from './enhancers/monitorReducer.js';
import loggerMiddleware from './middleware/logger.js';
import rootReducer from './rootReducer.js';
import { get } from 'lodash';

const actionSanitizer = (action) =>
  action.type === 'usCovidData/insertStatus' ||
  action.type === 'usCovidData/appendBadRecords' ||
  action.type === 'usCovidData/addBoundaries' ||
  action.type === 'usCovidData/setTotals' ||
  action.type === 'usCovidData/setPopulation' ||
  action.type === 'worldCovidData/load' ||
  action.type === 'worldCovidData/setTotals' ||
  action.type === 'worldCovidData/setPopulation'
    ? {
        ...action,
        payload: {
          keys: Object.keys(action.payload),
          length: get(Object.keys(action.payload), 'length'),
        },
      }
    : action;

const stateSanitizer = (state) => {
  let uiState = state.ui;
  if (state.ui.map.map) {
    const mapState = {
      ...state.ui.map,
      map: '<<MAP_OBJECT>>',
    };
    uiState = { ...state.ui, map: mapState };
  }

  let coreState = { ...state.core };
  if (state.core.worldCovidData) {
    const worldCovidState = {
      ...state.core.worldCovidData,
      byCountry: {
        keys: Object.keys(get(state, 'core.worldCovidData.byCountry')),
      },
      population: {
        keys: Object.keys(get(state, 'core.worldCovidData.population')),
      },
      totals: { length: get(state, 'core.worldCovidData.totals.length') },
    };
    coreState.worldCovidData = {
      ...worldCovidState,
    };
  }
  if (state.core.usCovidData) {
    const usCovidState = {
      ...state.core.usCovidData,
      casesByCounty: {
        keys: Object.keys(get(state, 'core.usCovidData.casesByCounty')),
      },
      byState: {
        keys: Object.keys(get(state, 'core.usCovidData.byState')),
      },
      stateAndCounty: {
        keys: Object.keys(get(state, 'core.usCovidData.stateAndCounty')),
      },
      badRecords: { length: get(state, 'core.usCovidData.badRecords.length') },
      totals: { length: get(state, 'core.usCovidData.totals.length') },
      population: {
        keys: Object.keys(get(state, 'core.usCovidData.population')),
      },
    };
    coreState.usCovidData = { ...usCovidState };
  }
  return {
    ...state,
    core: coreState,
    ui: uiState,
  };
};

export default function configureAppStore(preloadedState) {
  const storeConfig = {
    reducer: rootReducer,
    middleware: [
      ...getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }),
    ],
    preloadedState,
    enhancers: [],
    devTools: {
      actionSanitizer: (action) => actionSanitizer(action),
      stateSanitizer: (state) => stateSanitizer(state),
    },
  };

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./core', () => store.replaceReducer(rootReducer));
    storeConfig.middleware.push(loggerMiddleware);
    storeConfig.enhancers.push(monitorReducersEnhancer);
  }

  const store = configureStore(storeConfig);

  return store;
}
