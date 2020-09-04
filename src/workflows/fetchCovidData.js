import { get } from 'lodash';
import {
  addBoundaries,
  insertStatus,
  appendBadRecords,
  setTotals,
  setPopulation,
} from '../state/core/usCovidData.js';
import {
  load as worldDataLoad,
  setPopulation as worldSetPopulation,
} from '../state/core/worldCovidData.js';
import {
  aliveCheckPending,
  aliveCheckPassed,
  aliveCheckFailed,
} from '../state/core/apiServerStatus.js';

import * as usCasesByCountyStatus from '../state/request/usCasesByCounty.js';

export const fetchUsCasesByCounty = async (startIndex, pageSize, reverse) => {
  const response = await fetch(
    `/api/us-cases-by-county?startIndex=${startIndex}&pageSize=${pageSize}&reverse=${reverse}`
  );
  return response.json();
};

export const fetchWorldCovidData = async () => {
  return fetch('/api/global-covid-by-country');
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

export const initializeFeatureState = () => async (dispatch) => {
  let done = false;
  let startIndex = 0;
  let pageSize = 1000;

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

  const totalsPromise = fetchUsTotals();
  const populationPromise = fetchUsPopulation();
  const worldDataPromise = fetchWorldCovidData();
  const worldPopulationPromise = fetchWorldPopulation();

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
  dispatch(setTotals(await totalsPromise));
  dispatch(setPopulation(await populationPromise));

  dispatch(worldSetPopulation(await worldPopulationPromise));
  dispatch(
    worldDataLoad(
      sortWorldCasesByCountry((await (await worldDataPromise).json()).data)
    )
  );

  try {
    dispatch(usCasesByCountyStatus.requestPending(0));
    while (!done) {
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
    }
    dispatch(usCasesByCountyStatus.requestSucceeded());
  } catch (e) {
    dispatch(usCasesByCountyStatus.requestFailed(e));
  }
};
