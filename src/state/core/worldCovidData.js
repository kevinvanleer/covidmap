import { createSlice } from '@reduxjs/toolkit';

const worldCovidDataSlice = createSlice({
  name: 'worldCovidData',
  initialState: {
    byCountry: null,
    population: null,
  },
  reducers: {
    load: (state, action) => {
      state.byCountry = action.payload;
    },
    setPopulation: (state, action) => {
      state.population = action.payload;
    },
  },
});

export const { load, setPopulation } = worldCovidDataSlice.actions;
export default worldCovidDataSlice.reducer;
