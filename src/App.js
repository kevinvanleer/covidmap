import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { Details, Legend, About } from './components/structural';
import { Flexbox } from 'kvl-ui';

import {
  fetchUsCasesByCounty,
  fetchUsCovidBoundaries,
} from './workflows/fetchCovidData.js';

import FullscreenMap from './components/presentation/FullscreenMap.js';

import { layers, sources } from './mapboxConfig.js';

import { setCurrent } from './state/core/time.js';

const sortCasesByCounty = async (casesPromise, lowResPromise) => {
  const casesByCounty = {};
  const lowRes = await lowResPromise;
  lowRes.features.forEach((county) => {
    casesByCounty[parseInt(county.properties.FEATURE_ID)] = [
      {
        date: '2020-01-01',
        cases: 0,
        deaths: 0,
        county: county.properties.NAME,
        state: county.properties.STATE,
      },
    ];
  });

  const badRecords = [];
  const cases = await casesPromise;
  cases.data.forEach((status) => {
    const countyId = parseInt(status.fips);

    if (isNaN(countyId)) {
      badRecords.push(status);
    } else if (countyId in casesByCounty) {
      casesByCounty[countyId].push({
        date: status.date,
        cases: status.cases,
        deaths: status.deaths,
        county: status.county,
        state: status.state,
      });
    } else {
      casesByCounty[countyId] = [
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

  const nonReportingCounties = Object.entries(casesByCounty).filter(
    ([id, list]) => list.length === 1
  );
  console.log(`found ${badRecords.length} bad records`);
  console.log(`found ${nonReportingCounties.length} non-reporting counties`);

  return casesByCounty;
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
      setCasesByCounty(
        await sortCasesByCounty(
          fetchUsCasesByCounty(),
          fetchUsCovidBoundaries('20m')
        )
      );
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
