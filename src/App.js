import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { get, last } from 'lodash';

import {
  ControlPanel,
  About,
  AliveStatusWait,
  LegendBox,
} from './components/structural';
import { Flexbox } from 'kvl-ui';

import { initializeFeatureState } from './workflows/fetchCovidData.js';

import FullscreenMap from './components/presentation/FullscreenMap.js';

import { layers, sources } from './mapboxConfig.js';

import { setCurrent } from './state/core/time.js';

function App() {
  const dispatch = useDispatch();
  const aliveStatus = useSelector(
    (state) => state.core.apiServerStatus.aliveCheck
  );
  const collapsed = useSelector((state) => state.ui.controlPanel.collapsed);
  const layersHidden = useSelector(
    (state) => state.ui.controlPanel.layersHidden
  );
  const date = useSelector((state) => moment(state.core.time.current, 'x'));
  const totals = useSelector((state) => state.core.usCovidData.totals);
  const selectedFeature = useSelector((state) => state.ui.map.selectedFeature);
  const casesByCounty = useSelector(
    (state) => state.core.usCovidData.casesByCounty
  );
  const [activeLayers, setActiveLayers] = useState(
    layers.map((layer) => layer.id)
  );
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
        displayName: `${get(
          last(casesByCounty[selectedFeature]),
          'county'
        )}, ${get(last(casesByCounty[selectedFeature]), 'state')}`,
        data: casesByCounty[selectedFeature],
      }
    : { displayName: 'United States of America', data: totals };

  return aliveStatus.success ? (
    <>
      <ControlPanel
        layers={layers}
        activeLayers={activeLayers}
        updateActiveLayers={updateActiveLayers}
        date={moment(date)}
        onSetDate={onSetDate}
        onShowAbout={() => onShowAbout(true)}
        detailsData={detailsData}
      />
      <FullscreenMap
        date={date.format('YYYY-MM-DD')}
        sources={sources}
        layers={layers}
        activeLayers={activeLayers}
        casesByCounty={casesByCounty}
      />
      {collapsed || layersHidden ? <LegendBox /> : null}
      {showAbout ? (
        <Flexbox position="absolute" zIndex={100} maxHeight="100%">
          <About onHide={() => onShowAbout(false)} />
        </Flexbox>
      ) : null}
    </>
  ) : (
    <AliveStatusWait status={aliveStatus} />
  );
}

export default App;
