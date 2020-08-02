import React from 'react';
import PropTypes from 'prop-types';
import { Flexbox, Spacer, Text } from 'kvl-ui';

import { LegendItem } from '../presentation/LegendItem.js';
import { DateSelector } from './DateSelector.js';

export const Legend = ({
  layers,
  activeLayers,
  updateActiveLayers,
  date,
  setDate,
}) => (
  <Flexbox
    flexDirection="column"
    position="absolute"
    zIndex={10}
    right="1em"
    top="1em"
    backgroundColor="#444"
    color="#eee"
    padding="1em"
  >
    <Text fontSize="heading">COVID-19 Pandemic in the US</Text>
    <Spacer height="1em" />
    <Flexbox flexDirection="column" marginBetween="0.5em">
      {layers.map((layer) =>
        layer.legendHide ? null : (
          <LegendItem
            key={layer.id}
            onClick={() => updateActiveLayers(layer.id)}
            label={layer.id}
            active={activeLayers.includes(layer.id)}
          />
        )
      )}
    </Flexbox>
    <div style={{ height: '1em' }} />
    <DateSelector date={date} setDate={setDate} />
  </Flexbox>
);

Legend.propTypes = {
  layers: PropTypes.array,
  activeLayers: PropTypes.array,
  updateActiveLayers: PropTypes.func,
  date: PropTypes.string,
  setDate: PropTypes.func,
};