import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get } from 'lodash';
import { Flexbox, Spacer, Text, Button } from 'kvl-ui';
import { Details, Legend, DateSelector } from '.';
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
    <FloatingPanel right="1em" top="1em">
      <Button
        flexGrow={0}
        color="white"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <Text color="#eee">vvv</Text>
        ) : (
          <Text color="#eee">^^^</Text>
        )}
      </Button>
      {!collapsed ? (
        <Legend
          layers={layers}
          activeLayers={activeLayers}
          updateActiveLayers={updateActiveLayers}
        />
      ) : null}
      <Spacer height="1em" />
      <Details date={moment(date)} entity={detailsData} collapsed={collapsed} />
      <Spacer height="1em" />
      <DateSelector date={date} setDate={onSetDate} />
      {!collapsed ? (
        <>
          <Spacer height="1em" />
          <Button id="covidmap-show-about-box" onClick={onShowAbout}>
            <Text color="#eee">About</Text>
          </Button>
        </>
      ) : null}
    </FloatingPanel>
  );
};
