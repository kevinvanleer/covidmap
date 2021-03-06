import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

import { setShowAbout } from './state/ui/controlPanel.js';

function App() {
  const dispatch = useDispatch();
  const aliveStatus = useSelector(
    (state) => state.core.apiServerStatus.aliveCheck
  );
  const collapsed = useSelector((state) => state.ui.controlPanel.collapsed);
  const showAbout = useSelector((state) => state.ui.controlPanel.showAbout);
  const layersHidden = useSelector(
    (state) => state.ui.controlPanel.layersHidden
  );
  const date = useSelector((state) => state.core.time.current);
  const duration = useSelector((state) => state.core.time.duration);
  const activeLayers = useSelector((state) => state.ui.map.activeLayers);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, []);

  const theMoment = useMemo(() => moment(date, 'x'), [date]);
  const dateRange = useMemo(
    () => ({
      start: duration
        ? moment(theMoment).subtract(duration).format('YYYY-MM-DD')
        : null,
      end: theMoment.format('YYYY-MM-DD'),
    }),
    [theMoment, duration]
  );

  const onShowAbout = useCallback(
    (show) => {
      dispatch(setShowAbout(show));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(initializeFeatureState());
  }, [dispatch]);

  return aliveStatus.success ? (
    <>
      <ControlPanel
        layers={layers}
        activeLayers={activeLayers}
        date={theMoment}
        onShowAbout={() => onShowAbout(true)}
      />
      <FullscreenMap
        date={dateRange}
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
