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

import * as usCasesByCountyStatus from '../state/request/usCasesByCounty.js';

export const fetchUsCasesByCountyStream = async (dispatch) => {
  const response = await fetch(`/api/us-cases-by-county`);

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let unterminated;
  while (true) {
    let items = [];
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
    //console.log(items);
    dispatch(usDataAppend(items));
  }
};

export const fetchUsCasesByCounty = async (startIndex, pageSize, reverse) => {
  const response = await fetch(
    `/api/us-cases-by-county?startIndex=${startIndex}&pageSize=${pageSize}&reverse=${reverse}`
  );

  //HACK: csvtojson adds comma to last json array element, remove it
  let text = await response.text();
  if (text[text.length - 4] === ',') text = text.slice(0, -4) + text.slice(-3);
  return JSON.parse(text);
};

export const fetchGlobalCovidTotals = async () => {
  return (await fetch('/api/global-covid-totals')).json();
};

export const fetchUsCovidByState = async () => {
  return (await fetch('/api/us-covid-by-state')).json();
};

export const fetchWorldCovidData = async () => {
  //return (await fetch('/api/global-covid-by-country')).json();
  const response = await fetch('/api/global-covid-by-country');
  //
  //HACK: csvtojson adds comma to last json array element, remove it
  let text = await response.text();
  if (text[text.length - 4] === ',') text = text.slice(0, -4) + text.slice(-3);
  return JSON.parse(text);
};

export const fetchWorldCovidDataStream = async (dispatch) => {
  const response = await fetch('/api/global-covid-by-country');
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let unterminated;
  while (true) {
    let items = [];
    const { value, done } = await reader.read();
    if (done) break;
    let lines = value;
    if (unterminated) {
      lines = unterminated + value;
      unterminated = null;
    }
    lines.split('\n').forEach((line) => {
      if (line.endsWith('}') !== true) {
        unterminated = line;
      } else {
        items.push(JSON.parse(line));
      }
    });
    dispatch(worldDataAppend(items));
  }
};

export const fetchUsTotals = async () => {
  const response = await fetch(`/api/us-totals`);
  return response.json();
};

export const fetchWorldPopulation = async () => {
  const response = await fetch(`/resources/world-population-est-2019.json`);
  return response.json();
};

export const fetchUsPopulation = async () => {
  const response = await fetch(`/resources/us-estimated-population-2019.json`);
  return response.json();
};

export const fetchUsCovidBoundaries = async (resolution) => {
  const response = await fetch(`/api/us-counties?resolution=${resolution}`);
  return response.json();
};

export const fetchAliveCheck = async () => {
  return fetch(`/api/alive`);
};

/*
const sortWorldCasesByCountry = (data) => {
  const sorted = {};
  data.forEach((status) => {
    const countryId = status.Country_code;
    if (countryId in sorted) {
      sorted[countryId].push({
        date: status.Date_reported,
        cases: status.Cumulative_cases,
        deaths: status.Cumulative_deaths,
        newCases: status.New_cases,
        newDeaths: status.New_deaths,
        country: status.Country,
      });
    } else {
      sorted[countryId] = [
        {
          date: status.Date_reported,
          cases: status.Cumulative_cases,
          deaths: status.Cumulative_deaths,
          newCases: status.New_cases,
          newDeaths: status.New_deaths,
          country: status.Country,
        },
      ];
    }
  });
  return sorted;
};
*/

/*
const sortCasesByCounty = (newCases) => async (dispatch) => {
  let badRecords = [];
  let newStatus = {};

  newCases.forEach((status) => {
    const countyId = parseInt(status.fips);

    if (isNaN(countyId)) {
      badRecords.push(status);
    } else {
      const countyId = parseInt(status.fips);

      if (countyId in newStatus) {
        newStatus[countyId].push({
          date: status.date,
          cases: status.cases,
          deaths: status.deaths,
          county: status.county,
          state: status.state,
        });
      } else {
        newStatus[countyId] = [
          {
            date: status.date,
            cases: status.cases,
            deaths: status.deaths,
            county: status.county,
            state: status.state,
          },
        ];
      }
    }
  });

  dispatch(insertStatus(newStatus));
  dispatch(appendBadRecords(badRecords));
};
*/

export const initializeFeatureState = () => async (dispatch) => {
  //let done = false;
  //let startIndex = 0;
  //HACK: We're getting the results from a stream now
  //let pageSize = 1e12;

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
  //
  const totalsPromise = fetchUsTotals();
  const populationPromise = fetchUsPopulation();
  //const worldDataPromise = fetchWorldCovidData();
  const worldPopulationPromise = fetchWorldPopulation();
  const globalCovidTotalsPromise = fetchGlobalCovidTotals();
  const byStatePromise = fetchUsCovidByState();

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
  //dispatch(worldDataLoad(sortWorldCasesByCountry(await worldDataPromise)));
  fetchWorldCovidDataStream(dispatch);

  dispatch(setByState(await byStatePromise));

  dispatch(setTotals(await totalsPromise));
  dispatch(setPopulation(await populationPromise));

  dispatch(worldSetTotals(await globalCovidTotalsPromise));
  dispatch(worldSetPopulation(await worldPopulationPromise));

  try {
    dispatch(usCasesByCountyStatus.requestPending(0));
    /*while (!done) {
      const newCases = await fetchUsCasesByCounty(startIndex, pageSize, true);
      const data = newCases.data || newCases;
      dispatch(sortCasesByCounty(data));
      done = data.length < pageSize;
      startIndex += pageSize;
      pageSize *= 2;
      if (!done) {
        dispatch(
          usCasesByCountyStatus.requestPending(
            startIndex / get(newCases, 'meta.totalCount', NaN)
          )
        );
      }
    }*/
    fetchUsCasesByCountyStream(dispatch);
    dispatch(usCasesByCountyStatus.requestSucceeded());
  } catch (e) {
    dispatch(usCasesByCountyStatus.requestFailed(e));
  }
};
