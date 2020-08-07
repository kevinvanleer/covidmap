import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { get } from 'lodash';

import { Details, Legend, About } from './components/structural';
import { Flexbox } from 'kvl-ui';

import { initializeFeatureState } from './workflows/fetchCovidData.js';

import FullscreenMap from './components/presentation/FullscreenMap.js';

import { layers, sources } from './mapboxConfig.js';

import { setCurrent } from './state/core/time.js';

function App() {
  const dispatch = useDispatch();
  const date = useSelector((state) => moment(state.core.time.current, 'x'));
  const totals = useSelector((state) => state.core.usCovidData.totals);
  const casesByCounty = useSelector(
    (state) => state.core.usCovidData.casesByCounty
  );
  const [activeLayers, setActiveLayers] = useState(
    layers.map((layer) => layer.id)
  );
  const [selectedFeature, setSelectedFeature] = useState(null);
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
    dispatch(initializeFeatureState());
  }, [dispatch]);

  const onSetDate = useCallback(
    (newDate) => {
      dispatch(setCurrent(newDate));
    },
    [dispatch]
  );

  const detailsData = selectedFeature
    ? {
        displayName: `${get(casesByCounty, [
          selectedFeature,
          0,
          'county',
        ])}, ${get(casesByCounty, [selectedFeature, 0, 'state'])}`,
        data: casesByCounty[selectedFeature],
      }
    : { displayName: 'United States of America', data: totals };

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
      <Details date={moment(date)} entity={detailsData} />
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
