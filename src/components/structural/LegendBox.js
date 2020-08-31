import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { Legend } from '.';
import { FloatingPanel } from '../presentation/FloatingPanel';

export const LegendBox = ({ activeLayers }) => {
  const layers = useSelector((state) => state.ui.map.layers);
  const selectedGroup = useSelector((state) => state.ui.map.selectedLayerGroup);
  const legendConfig = layers
    .filter(
      (layer) =>
        selectedGroup.layers.includes(layer.id) &&
        activeLayers.includes(layer.id) &&
        get(layer, 'legend.gradient')
    )
    .map((layer) => layer.legend);
  const width = 48 * legendConfig.length;

  return (
    <FloatingPanel
      flexDirection="row"
      width="min-content"
      backgroundColor="transparent"
      zIndex={50}
      position="absolute"
      right={`calc(50% - ${width}px)`}
      bottom="0"
      padding="0"
      marginBetween="1.5em"
    >
      {legendConfig.map((cfg) => (
        <Legend
          key={cfg.label}
          fillColor={cfg.fillColor}
          gradient={cfg.gradient}
        />
      ))}
    </FloatingPanel>
  );
};

LegendBox.propTypes = {
  activeLayers: PropTypes.array,
};
