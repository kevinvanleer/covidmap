import React from 'react';
import { useSelector } from 'react-redux';
import { get } from 'lodash';
import { Legend } from '.';
import { FloatingPanel } from '../presentation/FloatingPanel';

export const LegendBox = () => {
  const layers = useSelector((state) => state.ui.map.layers);
  const selectedGroup = useSelector((state) => state.ui.map.selectedLayerGroup);
  const legendConfig = layers
    .filter(
      (layer) =>
        selectedGroup.layers.includes(layer.id) && get(layer, 'legend.gradient')
    )
    .map((layer) => layer.legend);

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
        <Legend
          key={cfg.label}
          fillColor={cfg.fillColor}
          gradient={cfg.gradient}
        />
      ))}
    </FloatingPanel>
  );
};
