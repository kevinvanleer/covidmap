import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { get, inRange } from 'lodash';
import { Legend } from '.';
import { FloatingPanel } from '../presentation/FloatingPanel';

export const LegendBox = ({ activeLayers }) => {
  const layers = useSelector((state) => state.ui.map.layers);
  const selectedGroup = useSelector((state) => state.ui.map.selectedLayerGroup);
  const map = useSelector((state) => state.ui.map.map);
  const zoomLevel = map ? map.getZoom() : 0;
  const legendLayers = layers.filter(
    (layer) =>
      selectedGroup.layers.includes(layer.id) &&
      activeLayers.includes(layer.id) &&
      get(layer, 'legend.gradient') &&
      inRange(
        zoomLevel,
        ...get(layer, 'legend.zoomLevels', [
          Number.NEGATIVE_INFINITY,
          Number.POSITIVE_INFINITY,
        ])
      )
  );
  const width = 48 * legendLayers.length;

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
      {legendLayers.map((layer) => (
        <Legend
          key={layer.legend.label}
          fillColor={layer.legend.fillColor}
          gradient={layer.legend.gradient}
        />
      ))}
    </FloatingPanel>
  );
};

LegendBox.propTypes = {
  activeLayers: PropTypes.array,
};
