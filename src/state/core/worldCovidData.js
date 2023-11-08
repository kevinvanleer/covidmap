import { createSlice } from '@reduxjs/toolkit';

const worldCovidDataSlice = createSlice({
  name: 'worldCovidData',
  initialState: {
    byCountry: {},
    population: {},
    totals: null,
  },
  reducers: {
    load: (state, action) => {
      state.byCountry = action.payload;
    },
    append: (state, action) => {
      const sorted = state.byCountry;
      action.payload.forEach((status) => {
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
      state.byCountry = sorted;
    },
    setPopulation: (state, action) => {
      state.population = action.payload;
    },
    setTotals: (state, action) => {
      state.totals = action.payload;
    },
  },
});

export const { load, append, setTotals, setPopulation } =
  worldCovidDataSlice.actions;
export default worldCovidDataSlice.reducer;
