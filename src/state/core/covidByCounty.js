import { createSlice } from '@reduxjs/toolkit';

const covidByCountySlice = createSlice({
  name: 'covidByCounty',
  initialState: { casesByCounty: {}, badRecords: [] },
  reducers: {
    load: (state, action) => {
      state.casesByCounty = action.payload;
    },
    addBoundaries: (state, action) => {
      state.casesByCounty = { ...state.casesByCounty, ...action.payload };
    },
    addBoundary: (state, action) => {
      const boundary = action.payload;
      state.casesByCounty[parseInt(boundary.properties.FEATURE_ID)] = [
        {
          date: '2020-01-01',
          cases: 0,
          deaths: 0,
          county: boundary.properties.NAME,
          state: boundary.properties.STATE,
        },
      ];
    },
    insertStatus: (state, action) => {
      Object.entries(action.payload).forEach(([id, statusArray]) => {
        if (id in state.casesByCounty) {
          state.casesByCounty[id] = [
            state.casesByCounty[id][0],
            ...statusArray,
            ...state.casesByCounty[id].slice(1),
          ];
        } else {
          state.casesByCounty[id] = statusArray;
        }
      });
    },
    appendStatus: (state, action) => {
      Object.entries(action.payload).forEach(([id, statusArray]) => {
        if (id in state.casesByCounty) {
          state.casesByCounty[id] = [
            ...state.casesByCounty[id],
            ...statusArray,
          ];
        } else {
          state.casesByCounty[id] = statusArray;
        }
      });
    },
    appendBadRecords: (state, action) => {
      state.badRecords = action.payload;
    },
  },
});

export const {
  load,
  appendStatus,
  insertStatus,
  appendBadRecords,
  addBoundary,
  addBoundaries,
} = covidByCountySlice.actions;
export default covidByCountySlice.reducer;
