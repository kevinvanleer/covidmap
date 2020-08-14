import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faLayerGroup,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import { Flexbox, Spacer, Text, SquareButton, Divider } from 'kvl-ui';
import { Details, Layers, DateSelector, DrawerButton } from '.';
import { FloatingPanel } from '../presentation/FloatingPanel';
import { ToggleButton } from '../presentation/ToggleButton';
import { LoadingIndicator } from '../presentation/LoadingIndicator';
import { loadingStatus } from '../../state/util/loadingStatus.js';

export const ControlPanel = ({
  layers,
  activeLayers,
  updateActiveLayers,
  detailsData,
  onShowAbout,
  onSetDate,
  date,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [hideLayers, setHideLayers] = useState(false);
  const [hideDetails, setHideDetails] = useState(false);
  const mapLoading = useSelector(
    (state) => state.ui.map.mapLoadStatus.status !== loadingStatus.complete
  );
  const sourcesLoading = useSelector(
    (state) => state.ui.map.sourcesLoadStatus.status !== loadingStatus.complete
  );
  const dataProgress = useSelector(
    (state) => state.request.usCasesByCounty.progress
  );

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
          <ToggleButton
            id="button-covidmap-control-panel-hide-layers"
            flexGrow={0}
            onClick={() => setHideLayers(!hideLayers)}
            icon={faLayerGroup}
            active={!hideLayers}
            backgroundColor="#777"
          />
          <ToggleButton
            id="button-covidmap-control-panel-hide-details"
            flexGrow={0}
            onClick={() => setHideDetails(!hideDetails)}
            icon={faChartBar}
            active={!hideDetails}
            backgroundColor="#777"
          />
          <DrawerButton
            id="button-covidmap-control-panel-collapse"
            flexGrow={0}
            color="white"
            onClick={() => setCollapsed(!collapsed)}
            collapsed={collapsed}
            backgroundColor="#777"
          />
        </Flexbox>
      </Flexbox>
      <Divider horizontal margin="0.5em 0" />
      {!hideLayers ? (
        <>
          <Layers
            layers={layers}
            activeLayers={activeLayers}
            updateActiveLayers={updateActiveLayers}
            collapsed={collapsed}
          />
          <Divider horizontal margin="1em 0 0.5em 0" />
        </>
      ) : null}
      {!hideDetails ? (
        <Details
          date={moment(date)}
          entity={detailsData}
          collapsed={collapsed}
        />
      ) : null}
      <DateSelector date={date} setDate={onSetDate} withChart={!hideDetails} />
      <Flexbox alignItems="flex-end">
        <LoadingIndicator progress={progress}>
          {loadingMessage}
        </LoadingIndicator>
        <Spacer flexGrow={1} />
        {!collapsed ? (
          <>
            <Spacer height="1em" />
            <SquareButton
              id="covidmap-show-about-box"
              onClick={onShowAbout}
              backgroundColor="#777"
            >
              <FontAwesomeIcon color="#eee" icon={faInfoCircle} />
            </SquareButton>
          </>
        ) : null}
      </Flexbox>
    </FloatingPanel>
  );
};

ControlPanel.propTypes = {
  layers: PropTypes.array,
  activeLayers: PropTypes.array,
  updateActiveLayers: PropTypes.func,
  detailsData: PropTypes.object,
  onShowAbout: PropTypes.func,
  onSetDate: PropTypes.func,
  date: PropTypes.object,
};
