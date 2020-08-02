import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import { last, set } from 'lodash';

import { Details, Legend } from './components/structural';

import { fetchUsCasesByCounty } from './workflows/fetchCovidData.js';

import FullscreenMap from './components/presentation/FullscreenMap.js';

import { layers, sources } from './mapboxConfig.js';

function App() {
  const [activeLayers, setActiveLayers] = useState(
    layers.map((layer) => layer.id)
  );
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [casesByCounty, setCasesByCounty] = useState(null);

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

  const onSetDate = useCallback((value) => {
    let newDate = moment().subtract(value, 'days');
    setDate(newDate.format('YYYY-MM-DD'));
  }, []);

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
    set(
      recentData,
      'deathRate.twoWeek',
      recentData.deaths / fourWeekLagData.cases
    );
    set(
      recentData,
      'deathRate.fourWeek',
      recentData.deaths / fourWeekLagData.cases
    );
    set(
      recentData,
      'deathRate.eightWeek',
      recentData.deaths / fourWeekLagData.cases
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
    </>
  );
}

export default App;
