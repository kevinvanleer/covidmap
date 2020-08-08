import React from 'react';
import PropTypes from 'prop-types';
import { Flexbox, Spacer, Text } from 'kvl-ui';

import { LegendItem } from '../presentation/LegendItem.js';

export const Legend = ({ layers, activeLayers, updateActiveLayers }) => (
  <Flexbox flexDirection="column">
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
  </Flexbox>
);

Legend.propTypes = {
  layers: PropTypes.array,
  activeLayers: PropTypes.array,
  updateActiveLayers: PropTypes.func,
};
