import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Flexbox, Spacer } from 'kvl-react-ui';

import { LayerItem } from '../presentation/LayerItem.js';
import { GroupSelect } from './GroupSelect.js';

import { updateActiveLayers, setActiveLayers } from '../../state/ui/map.js';

export const Layers = ({ layers, activeLayers, collapsed }) => {
  const dispatch = useDispatch();
  const selectedGroup = useSelector((state) => state.ui.map.selectedLayerGroup);
  const filteredLayers = layers.filter((layer) =>
    selectedGroup.layers.includes(layer.id)
  );

  const onUpdateActiveLayers = useCallback(
    (layer) => {
      if (layer?.legend?.mutex && !activeLayers.includes(layer.id)) {
        const mutexLayers = filteredLayers
          .filter((layer) => layer?.legend?.mutex)
          .map((layer) => layer.id);
        const newLayers = activeLayers.filter(
          (layer) => !mutexLayers.includes(layer)
        );
        dispatch(setActiveLayers(newLayers));
      }
      dispatch(updateActiveLayers(layer.id));
    },
    [dispatch, activeLayers, filteredLayers]
  );

  return (
    <Flexbox flexDirection="column">
      {!collapsed ? (
        <>
          <GroupSelect />
          <Spacer height="0.7em" />
        </>
      ) : null}
      <Flexbox flexWrap="wrap" wrapMargin="0.5em">
        {filteredLayers.map((layer) =>
          layer.legend === undefined ? null : (
            <LayerItem
              key={layer.id}
              onClick={() => onUpdateActiveLayers(layer)}
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
  collapsed: PropTypes.bool,
};
