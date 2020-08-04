import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import { get, last, set } from 'lodash';

import { Details, Legend, About } from './components/structural';
import { Flexbox } from 'kvl-ui';

import { fetchUsCasesByCounty } from './workflows/fetchCovidData.js';

import FullscreenMap from './components/presentation/FullscreenMap.js';

import { layers, sources } from './mapboxConfig.js';

function App() {
  const [activeLayers, setActiveLayers] = useState(
    layers.map((layer) => layer.id)
  );
  const [date, setDate] = useState(
    moment().subtract(1, 'days').format('YYYY-MM-DD')
  );
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [casesByCounty, setCasesByCounty] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [playRate, setPlayRate] = useState(10);
  const [startTime, setStartTime] = useState(null);

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
      setCasesByCounty(await fetchUsCasesByCounty());
    };
    initializeFeatureState();
  }, []);

  const onSetDate = useCallback((newDate) => {
    setDate(newDate.format('YYYY-MM-DD'));
  }, []);

  /*
  useEffect(() => {
    const step = (timestamp) => {
      let offset = startTime;
      if (offset === null) {
        setStartTime(timestamp);
        offset = timestamp;
      }
      let newDate = moment(date).add(
        ((timestamp - offset) / 1000) * playRate,
        'days'
      );
      if (newDate > moment().subtract(1, 'days')) {
        newDate = moment('2020-01-01');
      }
      onSetDate(newDate);
      if (playRate > 0) {
        requestAnimationFrame(step);
      } else {
        setStartTime(null);
      }
    };
    requestAnimationFrame(step);
  }, [date, playRate, startTime]);
  */

  let recentData = null;
  if (casesByCounty && selectedFeature) {
    recentData = last(
      casesByCounty[selectedFeature].filter((status) => status.date <= date)
    );
    const twoWeekLagData = last(
      casesByCounty[selectedFeature].filter(
        (status) =>
          status.date <= moment(date).subtract(2, 'weeks').format('YYYY-MM-DD')
      )
    );
    const fourWeekLagData = last(
      casesByCounty[selectedFeature].filter(
        (status) =>
          status.date <= moment(date).subtract(4, 'weeks').format('YYYY-MM-DD')
      )
    );
    const eightWeekLagData = last(
      casesByCounty[selectedFeature].filter(
        (status) =>
          status.date <= moment(date).subtract(8, 'weeks').format('YYYY-MM-DD')
      )
    );
    set(recentData, 'deathRate.current', recentData.deaths / recentData.cases);
    set(
      recentData,
      'deathRate.twoWeek',
      recentData.deaths / get(twoWeekLagData, 'cases') || 0
    );
    set(
      recentData,
      'deathRate.fourWeek',
      recentData.deaths / get(fourWeekLagData, 'cases') || 0
    );
    set(
      recentData,
      'deathRate.eightWeek',
      recentData.deaths / get(eightWeekLagData, 'cases') || 0
    );
  }
  return (
    <>
      <Legend
        layers={layers}
        activeLayers={activeLayers}
        updateActiveLayers={updateActiveLayers}
        date={date}
        setDate={onSetDate}
        onShowAbout={() => onShowAbout(true)}
      />
      {recentData ? (
        <Details info={recentData} data={casesByCounty[selectedFeature]} />
      ) : null}
      <FullscreenMap
        date={date}
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
