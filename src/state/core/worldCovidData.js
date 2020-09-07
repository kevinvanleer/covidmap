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
    setPopulation: (state, action) => {
      state.population = action.payload;
    },
    setTotals: (state, action) => {
      state.totals = action.payload;
    },
  },
});

export const { load, setTotals, setPopulation } = worldCovidDataSlice.actions;
export default worldCovidDataSlice.reducer;
