import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flexbox, Spacer, Text, SquareButton, Divider } from 'kvl-ui';
import { Details, Layers, DateSelector, DrawerButton, Legend } from '.';
import { FloatingPanel } from '../presentation/FloatingPanel';
import { ToggleButton } from '../presentation/ToggleButton';
import { LoadingIndicator } from '../presentation/LoadingIndicator';
import { loadingStatus } from '../../state/util/loadingStatus.js';

export const LegendBox = ({}) => {
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

  const legendConfig = [
    {
      name: 'Deaths',
      color: '#f00',
      gradient: [
        {
          magnitude: 10,
          opacity: 0.2,
        },
        {
          magnitude: 100,
          opacity: 0.4,
        },
        {
          magnitude: 1000,
          opacity: 0.7,
        },
        {
          magnitude: 2000,
          opacity: 0.8,
        },
      ],
    },
    {
      name: 'Cases',
      color: '#00f',
      gradient: [
        {
          magnitude: 10,
          opacity: 0.1,
        },
        {
          magnitude: 100,
          opacity: 0.2,
        },
        {
          magnitude: 10000,
          opacity: 0.4,
        },
        {
          magnitude: 200000,
          opacity: 0.8,
        },
      ],
    },
  ];
  return (
    <FloatingPanel
      flexDirection="row"
      width="min-content"
      backgroundColor="transparent"
      zIndex={50}
      position="absolute"
      right="calc(50% - 96px)"
      bottom="0"
      padding="0"
      marginBetween="1.5em"
    >
      {legendConfig.map((cfg) => (
        <Legend key={cfg.name} fillColor={cfg.color} gradient={cfg.gradient} />
      ))}
    </FloatingPanel>
  );
};
