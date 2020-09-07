import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import moment from 'moment';
import ReactGA from 'react-ga';

import {
  ControlPanel,
  About,
  AliveStatusWait,
  LegendBox,
} from './components/structural';
import { Flexbox } from 'kvl-react-ui';

import { initializeFeatureState } from './workflows/fetchCovidData.js';

import FullscreenMap from './components/presentation/FullscreenMap.js';

import { layers, sources } from './mapboxConfig.js';

import { setCurrent } from './state/core/time.js';
import { setShowAbout } from './state/ui/controlPanel.js';

function App() {
  const { enableLinkTracking, trackPageView } = useMatomo();

  const dispatch = useDispatch();
  const aliveStatus = useSelector(
    (state) => state.core.apiServerStatus.aliveCheck
  );
  const collapsed = useSelector((state) => state.ui.controlPanel.collapsed);
  const showAbout = useSelector((state) => state.ui.controlPanel.showAbout);
  const layersHidden = useSelector(
    (state) => state.ui.controlPanel.layersHidden
  );
  const date = useSelector((state) => moment(state.core.time.current, 'x'));
  const activeLayers = useSelector((state) => state.ui.map.activeLayers);

  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize('UA-55310450-2');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  // Track page view
  enableLinkTracking();
  React.useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  const onShowAbout = useCallback(
    (show) => {
      dispatch(setShowAbout(show));
    },
    [dispatch]
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

  return aliveStatus.success ? (
    <>
      <ControlPanel
        layers={layers}
        activeLayers={activeLayers}
        date={moment(date)}
        onSetDate={onSetDate}
        onShowAbout={() => onShowAbout(true)}
      />
      <FullscreenMap
        date={date.format('YYYY-MM-DD')}
        sources={sources}
        layers={layers}
        activeLayers={activeLayers}
      />
      {collapsed || layersHidden ? (
        <LegendBox activeLayers={activeLayers} />
      ) : null}
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
