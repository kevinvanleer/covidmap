import { createSlice } from '@reduxjs/toolkit';

const usCovidDataSlice = createSlice({
  name: 'usCovidData',
  initialState: {
    totals: [
      {
        date: undefined,
        cases: 0,
        deaths: 0,
      },
    ],
    casesByCounty: {},
    badRecords: [],
  },
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
          date: undefined,
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
    setTotals: (state, action) => {
      state.totals = [
        {
          date: undefined,
          cases: 0,
          deaths: 0,
        },
        ...action.payload.data,
      ];
    },
    setPopulation: (state, action) => {
      state.population = action.payload.population;
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
  setTotals,
  setPopulation,
} = usCovidDataSlice.actions;
export default usCovidDataSlice.reducer;
