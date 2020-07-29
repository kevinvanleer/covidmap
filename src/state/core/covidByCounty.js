import { createSlice } from '@reduxjs/toolkit';

const covidByCountySlice = createSlice({
  name: 'covidByCounty',
  initialState: [],
  reducers: {
    load: (state, action) => (state = action.payload),
  },
});

export const { load } = covidByCountySlice.actions;
export default covidByCountySlice.reducer;
