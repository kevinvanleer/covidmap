import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';

import { Details, Legend, About } from './components/structural';
import { Flexbox } from 'kvl-ui';

import { fetchUsCasesByCounty } from './workflows/fetchCovidData.js';

import FullscreenMap from './components/presentation/FullscreenMap.js';

import { layers, sources } from './mapboxConfig.js';

function App() {
  const [activeLayers, setActiveLayers] = useState(
    layers.map((layer) => layer.id)
  );
  const [date, setDate] = useState(moment().subtract(1, 'days'));
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
      setCasesByCounty(await fetchUsCasesByCounty());
    };
    initializeFeatureState();
  }, []);

  const onSetDate = useCallback((newDate) => {
    setDate(newDate);
  }, []);

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
      {selectedFeature ? (
        <Details date={date} data={casesByCounty[selectedFeature]} />
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
