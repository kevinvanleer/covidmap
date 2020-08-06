import {
  addBoundaries,
  insertStatus,
  appendBadRecords,
} from '../state/core/covidByCounty.js';

/*
const covidByCountyUrl =
  'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv';

export const fetchUsCovidByCounty = () => (dispatch) => {
  Papa.parse(covidByCountyUrl, {
    download: true,
    complete: (result) => {
      dispatch(load(result.data));
    },
  });
};

export const updateUsCasesByCounty = () => async (dispatch) => {
  dispatch(await fetchUsCasesByCounty());
};

*/

export const fetchUsCasesByCounty = async (startIndex, pageSize, reverse) => {
  const response = await fetch(
    `/api/us-cases-by-county?startIndex=${startIndex}&pageSize=${pageSize}&reverse=${reverse}`
  );
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
      //dispatch(appendBadRecord(status));
      badRecords.push(status);
    } else {
      //dispatch(appendStatus(status));
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
  /*
  const nonReportingCounties = Object.entries(sortedCases).filter(
    ([id, list]) => list.length === 1
  );
  console.log(`found ${badRecords.length} bad records`);
  console.log(`found ${nonReportingCounties.length} non-reporting counties`);
  */

  //return sortedCases;
};

export const initializeFeatureState = () => async (dispatch) => {
  let done = false;
  let startIndex = 0;
  let pageSize = 1000;

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

  while (!done) {
    const newCases = await fetchUsCasesByCounty(startIndex, pageSize, true);
    dispatch(sortCasesByCounty(newCases));
    done = newCases.length < pageSize;
    startIndex += pageSize;
    pageSize *= 2;
  }
};
