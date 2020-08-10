import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMinusSquare,
  faPlusSquare,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Flexbox, Spacer, Text, SquareButton } from 'kvl-ui';
import { Details, Legend, DateSelector, DrawerButton } from '.';
import { FloatingPanel } from '../presentation/FloatingPanel';

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
  return (
    <FloatingPanel right="1em" top="1em" backgroundColor="rgba(68,68,68,0.85)">
      <Flexbox alignItems="center">
        <Text fontSize="heading">COVID-19</Text>
        <Spacer width="1em" flexGrow={1} />
        <DrawerButton
          id="button-covidmap-control-panel-collapse"
          flexGrow={0}
          color="white"
          onClick={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
          backgroundColor="#777"
        />
      </Flexbox>
      {!collapsed ? (
        <Legend
          layers={layers}
          activeLayers={activeLayers}
          updateActiveLayers={updateActiveLayers}
        />
      ) : null}
      <Spacer height="1em" />
      <Details date={moment(date)} entity={detailsData} collapsed={collapsed} />
      <DateSelector date={date} setDate={onSetDate} />
      <Flexbox>
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
