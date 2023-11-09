import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  append as usDataAppend,
  addBoundaries,
  setTotals,
  setPopulation,
  setByState,
} from '../state/core/usCovidData.js';
import {
  append as worldDataAppend,
  setPopulation as worldSetPopulation,
  setTotals as worldSetTotals,
} from '../state/core/worldCovidData.js';
import {
  aliveCheckPending,
  aliveCheckPassed,
  aliveCheckFailed,
} from '../state/core/apiServerStatus.js';
import { setTimeRange } from '../state/core/time.js';

import * as usCasesByCountyStatus from '../state/request/usCasesByCounty.js';

export const readResponse = createAsyncThunk(
  'fetchCovidData/readResponse',
  async ({ response, reducer }, { dispatch }) => {
    const reader = response.body
      .pipeThrough(new DecompressionStream('gzip'))
      .pipeThrough(new TextDecoderStream())
      .getReader();
    let unterminated;
    let items = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      let lines = value;
      if (unterminated) {
        lines = unterminated + lines;
        unterminated = null;
      }
      lines.split('\n').forEach((line) => {
        if (line.endsWith('}') !== true) {
          unterminated = line;
        } else {
          items.push(JSON.parse(line));
        }
      });
      if (items.length > 1e5) {
        dispatch(reducer(items));
        items = [];
      }
    }
    dispatch(reducer(items));
  }
);

export const fetchUsCasesByCounty = createAsyncThunk(
  'usCasesByCounty/pipe',
  async () => fetch(`/api/us-cases-by-county`)
);

export const fetchGlobalCovidTotals = createAsyncThunk(
  'worldCovidData/totals',
  async (_, { dispatch }) => {
    const response = await fetch('/api/global-covid-totals');
    dispatch(worldSetTotals(await response.json()));
  }
);

export const fetchUsCovidByState = createAsyncThunk(
  'usCovidData/fetchByState',
  async (_, { dispatch }) => {
    const byStatePromise = (await fetch('/api/us-covid-by-state')).json();
    const byState = await byStatePromise;
    const dates = byState.data.map((a) => a.date).sort();
    dispatch(setTimeRange({ start: dates[0], end: dates[dates.length - 1] }));
    dispatch(setByState(byState));
  }
);

export const fetchWorldCovidData = createAsyncThunk(
  'globalCovidByCountry/pipe',
  async () => fetch('/api/global-covid-by-country')
);

export const fetchUsTotals = createAsyncThunk(
  'usCovidData/fetchUsTotals',
  async (_, { dispatch }) => {
    const response = await fetch(`/api/us-totals`);
    dispatch(setTotals(await response.json()));
  }
);

export const fetchWorldPopulation = createAsyncThunk(
  'worldCovidData/fetchPopulation',
  async (_, { dispatch }) => {
    const response = await fetch(`/resources/world-population-est-2019.json`);
    dispatch(worldSetPopulation(await response.json()));
  }
);

export const fetchUsPopulation = createAsyncThunk(
  'usCovidData/fetchPopulation',
  async (_, { dispatch }) => {
    const response = await fetch(
      `/resources/us-estimated-population-2019.json`
    );
    dispatch(setPopulation(await response.json()));
  }
);

export const fetchUsCovidBoundaries = async (resolution) => {
  const response = await fetch(`/api/us-counties?resolution=${resolution}`);
  return response.json();
};

export const fetchAliveCheck = async () => {
  return fetch(`/api/alive`);
};

const fetchBoundaries = createAsyncThunk(
  'boundaries/fetch',
  async (_, { dispatch }) => {
    const boundaries = await fetchUsCovidBoundaries('20m');
    const boundaryStates = {};
    boundaries.features.forEach((boundary) => {
      boundaryStates[parseInt(boundary.properties.FEATURE_ID)] = [
        {
          date: undefined,
          cases: 0,
          deaths: 0,
          county: boundary.properties.NAME,
          state: boundary.properties.STATE,
        },
      ];
    });
    dispatch(addBoundaries(boundaryStates));
  }
);

export const initializeFeatureState = () => async (dispatch) => {
  dispatch(aliveCheckPending());
  try {
    const aliveResponse = await fetchAliveCheck();
    if (aliveResponse.ok) {
      dispatch(aliveCheckPassed(await aliveResponse.text()));
    } else {
      dispatch(aliveCheckFailed(aliveResponse.error(aliveResponse.error())));
    }
  } catch (e) {
    dispatch(aliveCheckFailed(e));
  }

  dispatch(usCasesByCountyStatus.requestPending(0));
  dispatch(fetchUsCasesByCounty())
    .unwrap()
    .then(async (response) => {
      dispatch(usCasesByCountyStatus.requestPending(0.001));
      await dispatch(readResponse({ response, reducer: usDataAppend }));
      dispatch(usCasesByCountyStatus.requestPending(1));
      dispatch(usCasesByCountyStatus.requestSucceeded());
    })
    .catch((reject) => {
      dispatch(usCasesByCountyStatus.requestFailed(reject));
    });

  dispatch(fetchBoundaries());
  dispatch(fetchWorldCovidData())
    .unwrap()
    .then((response) =>
      dispatch(readResponse({ response, reducer: worldDataAppend }))
    );

  dispatch(fetchUsCovidByState());

  dispatch(fetchUsTotals());
  dispatch(fetchUsPopulation());

  dispatch(fetchGlobalCovidTotals());
  dispatch(fetchWorldPopulation());
};
