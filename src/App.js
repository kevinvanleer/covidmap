import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { isEmpty } from 'lodash';

import { Details, Legend, About } from './components/structural';
import { Flexbox } from 'kvl-ui';

import {
  fetchUsCasesByCounty,
  fetchUsCovidBoundaries,
} from './workflows/fetchCovidData.js';

import FullscreenMap from './components/presentation/FullscreenMap.js';

import { layers, sources } from './mapboxConfig.js';

import { setCurrent } from './state/core/time.js';

const sortCasesByCounty = async (
  casesPromise,
  lowResPromise,
  inputCases = {}
) => {
  const sortedCases = inputCases;
  if (isEmpty(sortedCases)) {
    const lowRes = await lowResPromise;
    lowRes.features.forEach((county) => {
      sortedCases[parseInt(county.properties.FEATURE_ID)] = [
        {
          date: '2020-01-01',
          cases: 0,
          deaths: 0,
          county: county.properties.NAME,
          state: county.properties.STATE,
        },
      ];
    });
  }

  const badRecords = [];
  const newCases = await casesPromise;
  newCases.forEach((status) => {
    const countyId = parseInt(status.fips);

    if (isNaN(countyId)) {
      badRecords.push(status);
    } else if (countyId in sortedCases) {
      sortedCases[countyId].push({
        date: status.date,
        cases: status.cases,
        deaths: status.deaths,
        county: status.county,
        state: status.state,
      });
    } else {
      sortedCases[countyId] = [
        {
          date: status.date,
          cases: status.cases,
          deaths: status.deaths,
          county: status.county,
          state: status.state,
        },
      ];
    }
  });

  const nonReportingCounties = Object.entries(sortedCases).filter(
    ([id, list]) => list.length === 1
  );
  console.log(`found ${badRecords.length} bad records`);
  console.log(`found ${nonReportingCounties.length} non-reporting counties`);

  return sortedCases;
};

function App() {
  const dispatch = useDispatch();
  const date = useSelector((state) => moment(state.core.time.current, 'x'));
  const [activeLayers, setActiveLayers] = useState(
    layers.map((layer) => layer.id)
  );
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [casesByCounty, setCasesByCounty] = useState(null);
  const [showAbout, setShowAbout] = useState(false);

  const onShowAbout = useCallback((show) => {
    setShowAbout(show);
  }, []);

  const updateActiveLayers = useCallback(
    (layerId) => {
      const currentState = activeLayers.includes(layerId);
      setActiveLayers(
        currentState
          ? activeLayers.filter((item) => item !== layerId)
          : [...activeLayers, layerId]
      );
    },
    [activeLayers]
  );

  useEffect(() => {
    const initializeFeatureState = async () => {
      let done = false;
      let startIndex = 0;
      let pageSize = 1000;
      let cases = {};
      const boundaryPromise = fetchUsCovidBoundaries('20m');
      while (!done) {
        const casesPromise = fetchUsCasesByCounty(startIndex, pageSize, false);
        const sortPromise = sortCasesByCounty(
          casesPromise,
          boundaryPromise,
          cases
        );
        const newCases = await casesPromise;
        done = newCases.length < pageSize;
        startIndex += pageSize;
        pageSize *= 2;
        cases = await sortPromise;
        setCasesByCounty(cases);
      }
    };
    initializeFeatureState();
  }, []);

  const onSetDate = useCallback(
    (newDate) => {
      dispatch(setCurrent(newDate));
    },
    [dispatch]
  );

  return (
    <>
      <Legend
        layers={layers}
        activeLayers={activeLayers}
        updateActiveLayers={updateActiveLayers}
        date={moment(date)}
        setDate={onSetDate}
        onShowAbout={() => onShowAbout(true)}
      />
      {selectedFeature ? (
        <Details date={moment(date)} data={casesByCounty[selectedFeature]} />
      ) : null}
      <FullscreenMap
        date={date.format('YYYY-MM-DD')}
        sources={sources}
        layers={layers}
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
        activeLayers={activeLayers}
        casesByCounty={casesByCounty}
      />
      {showAbout ? (
        <Flexbox position="absolute" zIndex={10}>
          <About onHide={() => onShowAbout(false)} />
        </Flexbox>
      ) : null}
    </>
  );
}

export default App;
