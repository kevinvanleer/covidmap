import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Flexbox, Text, Spacer } from 'kvl-react-ui';

import { LayerItem } from '../presentation/LayerItem.js';
import { GroupSelect } from './GroupSelect.js';

export const Layers = ({
  layers,
  activeLayers,
  updateActiveLayers,
  collapsed,
}) => {
  const selectedGroup = useSelector((state) => state.ui.map.selectedLayerGroup);
  const filteredLayers = layers.filter((layer) =>
    selectedGroup.layers.includes(layer.id)
  );

  return (
    <Flexbox flexDirection="column">
      {!collapsed ? (
        <>
          <Flexbox>
            <Text bold fontSize="label">
              Layers
            </Text>
            <Spacer width="1em" />
            <GroupSelect />
          </Flexbox>
          <Spacer height="0.5em" />
        </>
      ) : null}
      <Flexbox flexWrap="wrap" wrapMargin="0.5em">
        {filteredLayers.map((layer) =>
          layer.legend === undefined ? null : (
            <LayerItem
              key={layer.id}
              onClick={() => updateActiveLayers(layer.id)}
              config={layer.legend}
              active={activeLayers.includes(layer.id)}
              collapsed={collapsed}
            />
          )
        )}
      </Flexbox>
    </Flexbox>
  );
};

Layers.propTypes = {
  layers: PropTypes.array,
  activeLayers: PropTypes.array,
  updateActiveLayers: PropTypes.func,
  collapsed: PropTypes.bool,
};
