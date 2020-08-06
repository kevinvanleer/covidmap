import Papa from 'papaparse';
import { load } from '../state/core/covidByCounty.js';

const covidByCountyUrl =
  'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv';

export const fetchUsCovidByCounty = () => (dispatch) => {
  console.debug('fetching');
  Papa.parse(covidByCountyUrl, {
    download: true,
    complete: (result) => {
      console.debug('got result');
      console.debug(result);
      dispatch(load(result.data));
    },
  });
};

export const fetchUsCasesByCounty = async () => {
  const response = await fetch('/api/us-cases-by-county');
  return response.json();
};

export const fetchUsCovidBoundaries = async (resolution) => {
  const response = await fetch(`/api/us-counties?resolution=${resolution}`);
  return response.json();
};

export const updateUsCasesByCounty = () => async (dispatch) => {
  dispatch(await fetchUsCasesByCounty());
};
