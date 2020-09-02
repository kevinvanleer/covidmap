import { createSlice } from '@reduxjs/toolkit';

const worldCovidDataSlice = createSlice({
  name: 'worldCovidData',
  initialState: {
    byCounty: [],
  },
  reducers: {
    load: (state, action) => {
      state.byCounty = action.payload;
    },
  },
});

export const { load } = worldCovidDataSlice.actions;
export default worldCovidDataSlice.reducer;
