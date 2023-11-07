import { createSlice } from '@reduxjs/toolkit';

const usCovidDataSlice = createSlice({
  name: 'usCovidData',
  initialState: {
    startDate: undefined,
    endDate: undefined,
    totals: [
      {
        date: undefined,
        cases: 0,
        deaths: 0,
      },
    ],
    casesByCounty: {},
    byState: {},
    stateAndCounty: {},
    badRecords: [],
    population: {},
  },
  reducers: {
    load: (state, action) => {
      state.casesByCounty = action.payload;
      state.stateAndCounty = { ...state.byState, ...state.casesByCounty };
    },
    append: (state, action) => {
      let badRecords = [...state.badRecords];
      let newStatus = { ...state.casesByCounty };

      action.payload.forEach((status) => {
        const countyId = parseInt(status.fips);

        if (isNaN(countyId)) {
          badRecords.push(status);
        } else {
          const countyId = parseInt(status.fips);

          if (countyId in newStatus) {
            newStatus[countyId].push({
              date: status.date,
              cases: status.cases,
              deaths: status.deaths,
              county: status.county,
              state: status.state,
            });
          } else {
            newStatus[countyId] = [
              {
                date: status.date,
                cases: status.cases,
                deaths: status.deaths,
                county: status.county,
                state: status.state,
              },
            ];
          }
        }
      });

      state.casesByCounty = newStatus;
      state.badRecords = badRecords;
      state.stateAndCounty = { ...state.byState, ...state.casesByCounty };
    },
    addBoundaries: (state, action) => {
      state.casesByCounty = { ...state.casesByCounty, ...action.payload };
      state.stateAndCounty = { ...state.byState, ...state.casesByCounty };
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
      state.stateAndCounty = { ...state.byState, ...state.casesByCounty };
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
      state.stateAndCounty = { ...state.byState, ...state.casesByCounty };
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
      let newState = {};
      action.payload.population.forEach(
        (record) =>
          (newState[
            record.COUNTY === '000'
              ? parseInt(record.STATE)
              : parseInt(record.FIPS)
          ] = record)
      );
      state.population = newState;
    },
    setByState: (state, action) => {
      const newState = {};
      action.payload.data.forEach((record) => {
        const id = parseInt(record.fips);
        if (id in newState) {
          newState[id].push(record);
        } else {
          newState[id] = [record];
        }
      });
      state.startDate = action.payload.data[0].date;
      state.endDate = action.payload.data[action.payload.data.length - 1].date;
      state.byState = newState;
      state.stateAndCounty = { ...newState, ...state.casesByCounty };
    },
  },
});

export const {
  load,
  append,
  appendStatus,
  insertStatus,
  appendBadRecords,
  addBoundary,
  addBoundaries,
  setTotals,
  setPopulation,
  setByState,
} = usCovidDataSlice.actions;
export default usCovidDataSlice.reducer;
