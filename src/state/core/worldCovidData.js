import { createSlice } from '@reduxjs/toolkit';

const worldCovidDataSlice = createSlice({
  name: 'worldCovidData',
  initialState: {
    byCountry: null,
  },
  reducers: {
    load: (state, action) => {
      state.byCountry = action.payload;
    },
  },
});

export const { load } = worldCovidDataSlice.actions;
export default worldCovidDataSlice.reducer;
