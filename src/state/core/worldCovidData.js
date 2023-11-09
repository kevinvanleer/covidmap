import { createSlice } from '@reduxjs/toolkit';

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

const worldCovidDataSlice = createSlice({
  name: 'worldCovidData',
  initialState: {
    startDate: undefined,
    endDate: undefined,
    byCountry: {},
    population: {},
    totals: null,
  },
  reducers: {
    load: (state, action) => {
      state.byCountry = sortWorldCasesByCountry(action.payload);
      state.startDate = action.payload[0].Date_reported;
      state.endDate = action.payload[action.payload.length - 1].Date_reported;
    },
    append: (state, action) => {
      const sorted = { ...state.byCountry };
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
