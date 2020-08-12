import {
  addBoundaries,
  insertStatus,
  appendBadRecords,
  setTotals,
} from '../state/core/usCovidData.js';

export const fetchUsCasesByCounty = async (startIndex, pageSize, reverse) => {
  const response = await fetch(
    `/api/us-cases-by-county?startIndex=${startIndex}&pageSize=${pageSize}&reverse=${reverse}`
  );
  return response.json();
};

export const fetchUsTotals = async () => {
  const response = await fetch(`/api/us-totals`);
  return response.json();
};

export const fetchUsCovidBoundaries = async (resolution) => {
  const response = await fetch(`/api/us-counties?resolution=${resolution}`);
  return response.json();
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

  const totalsPromise = fetchUsTotals();

  const boundaries = await fetchUsCovidBoundaries('20m');
  const boundaryStates = {};
  boundaries.features.forEach((boundary) => {
    boundaryStates[parseInt(boundary.properties.FEATURE_ID)] = [
      {
        date: '2020-01-01',
        cases: 0,
        deaths: 0,
        county: boundary.properties.NAME,
        state: boundary.properties.STATE,
      },
    ];
  });
  dispatch(addBoundaries(boundaryStates));
  dispatch(setTotals(await totalsPromise));

  while (!done) {
    const newCases = await fetchUsCasesByCounty(startIndex, pageSize, true);
    dispatch(sortCasesByCounty(newCases));
    done = newCases.length < pageSize;
    startIndex += pageSize;
    pageSize *= 2;
  }
};
