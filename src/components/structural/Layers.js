import React from 'react';
import PropTypes from 'prop-types';
import { Flexbox, Text, Spacer } from 'kvl-ui';

import { LayerItem } from '../presentation/LayerItem.js';

export const Layers = ({ layers, activeLayers, updateActiveLayers }) => (
  <Flexbox flexDirection="column">
    <Text fontSize="label">Layers</Text>
    <Spacer height="0.5em" />
    <Flexbox flexWrap="wrap" wrapMargin="0.5em">
      {layers.map((layer) =>
        layer.legend === undefined ? null : (
          <LayerItem
            key={layer.id}
            onClick={() => updateActiveLayers(layer.id)}
            config={layer.legend}
            active={activeLayers.includes(layer.id)}
          />
        )
      )}
    </Flexbox>
  </Flexbox>
);

Layers.propTypes = {
  layers: PropTypes.array,
  activeLayers: PropTypes.array,
  updateActiveLayers: PropTypes.func,
};
