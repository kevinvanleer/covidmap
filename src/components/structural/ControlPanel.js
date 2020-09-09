import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  faInfoCircle,
  faLayerGroup,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import {
  Flexbox,
  Spacer,
  Text,
  SquareButton,
  Divider,
  Icon,
} from 'kvl-react-ui';
import { Details, Layers, DateSelector, DrawerButton } from '.';
import { FloatingPanel } from '../presentation/FloatingPanel';
import { ToggleButton } from '../presentation/ToggleButton';
import { LoadingIndicator } from '../presentation/LoadingIndicator';
import { loadingStatus } from '../../state/util/loadingStatus.js';
import {
  hideLayers,
  hideDetails,
  collapse,
} from '../../state/ui/controlPanel.js';

export const ControlPanel = ({ layers, activeLayers, onShowAbout, date }) => {
  const dispatch = useDispatch();
  const collapsed = useSelector((state) => state.ui.controlPanel.collapsed);
  const layersHidden = useSelector(
    (state) => state.ui.controlPanel.layersHidden
  );
  const detailsHidden = useSelector(
    (state) => state.ui.controlPanel.detailsHidden
  );
  const mapLoading = useSelector(
    (state) => state.ui.map.mapLoadStatus.status !== loadingStatus.complete
  );
  const sourcesLoading = useSelector(
    (state) => state.ui.map.sourcesLoadStatus.status !== loadingStatus.complete
  );
  const dataProgress = useSelector(
    (state) => state.request.usCasesByCounty.progress
  );

  const onToggleHideLayers = useCallback(
    () => dispatch(hideLayers(!layersHidden)),
    [layersHidden, dispatch]
  );

  const onToggleHideDetails = useCallback(
    () => dispatch(hideDetails(!detailsHidden)),
    [detailsHidden, dispatch]
  );

  const onToggleCollapse = useCallback(() => dispatch(collapse(!collapsed)), [
    collapsed,
    dispatch,
  ]);

  let loadingMessage = null;
  let progress = sourcesLoading || mapLoading ? 0 : dataProgress;
  if (dataProgress < 1) loadingMessage = 'Downloading pandemic statistics...';
  if (dataProgress === 0) loadingMessage = 'Requesting pandemic statistics...';
  if (sourcesLoading) loadingMessage = 'Downloading boundary tiles...';
  if (mapLoading) loadingMessage = 'Initializing base map...';

  return (
    <FloatingPanel
      width="min-content"
      right="1em"
      top="1em"
      backgroundColor="rgba(68,68,68,0.85)"
      zIndex={100}
    >
      <Flexbox alignItems="center">
        <Text nowrap fontSize="heading">
          COVID-19
        </Text>
        <Spacer width="1em" flexGrow={1} />
        <Flexbox marginBetween="0.2em" alignItems="center">
          <SquareButton
            id="covidmap-show-about-box"
            onClick={onShowAbout}
            backgroundColor="#777"
          >
            <Icon color="#eee" icon={faInfoCircle} fixedWidth />
          </SquareButton>
          <Spacer width="0.1em" flexGrow={1} />
          <ToggleButton
            id="button-covidmap-control-panel-hide-layers"
            flexGrow={0}
            onClick={onToggleHideLayers}
            icon={faLayerGroup}
            active={!layersHidden}
            backgroundColor="#777"
          />
          <ToggleButton
            id="button-covidmap-control-panel-hide-details"
            flexGrow={0}
            onClick={onToggleHideDetails}
            icon={faChartBar}
            active={!detailsHidden}
            backgroundColor="#777"
          />
          <Spacer width="0.1em" flexGrow={1} />
          <DrawerButton
            id="button-covidmap-control-panel-collapse"
            flexGrow={0}
            color="white"
            onClick={onToggleCollapse}
            collapsed={collapsed}
            backgroundColor="#777"
          />
        </Flexbox>
      </Flexbox>
      <Divider horizontal margin="0.5em 0" />
      {!layersHidden ? (
        <>
          <Layers
            layers={layers}
            activeLayers={activeLayers}
            collapsed={collapsed}
          />
          <Divider horizontal margin="0.5em 0" />
        </>
      ) : null}
      {!detailsHidden ? (
        <Details date={moment(date)} collapsed={collapsed} />
      ) : null}
      <DateSelector withChart={!detailsHidden} />
      {loadingMessage ? (
        <Flexbox flexDirection="column">
          <Spacer height="1em" />
          <LoadingIndicator progress={progress}>
            {loadingMessage}
          </LoadingIndicator>
        </Flexbox>
      ) : null}
    </FloatingPanel>
  );
};

ControlPanel.propTypes = {
  layers: PropTypes.array,
  activeLayers: PropTypes.array,
  onShowAbout: PropTypes.func,
  date: PropTypes.object,
};
