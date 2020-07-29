import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

//import { fetchUsCovidByCounty } from './workflows/fetchCovidData.js';
//import { fetchUsCasesByCounty } from './workflows/fetchCovidData.js';

import FullscreenMap from './components/presentation/FullscreenMap.js';

const LegendItem = styled(({ className, onClick, label }) => (
  <div className={className} onClick={onClick}>
    {label}
  </div>
))`
  cursor: pointer;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
`;
const Legend = styled(
  ({ className, layers, activeLayers, updateActiveLayers }) => {
    return (
      <div className={className}>
        {layers.map((layer) => (
          <LegendItem
            key={layer.id}
            onClick={() => updateActiveLayers(layer.id)}
            label={layer.id}
            active={activeLayers.includes(layer.id)}
          />
        ))}
      </div>
    );
  }
)`
  position: absolute;
  z-index: 10;
  right: 1em;
  top: 1em;
  background-color: #444;
  color: #eee;
  padding: 1em;
`;

const layers = [
  {
    id: 'us-county-total-deaths',
    type: 'fill',
    source: 'us-counties',
    paint: {
      'fill-color': '#f00',
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['feature-state', 'deaths'],
        0,
        0,
        1,
        0.1,
        10,
        0.2,
        100,
        0.5,
        1000,
        0.9,
        2000,
        1,
      ],
    },
  },
  {
    id: 'us-county-total-cases',
    type: 'fill',
    source: 'us-counties',
    paint: {
      'fill-color': '#00f',
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['feature-state', 'cases'],
        0,
        0,
        10,
        0.1,
        100,
        0.2,
        10000,
        0.5,
        100000,
        0.9,
        200000,
        1,
      ],
    },
  },
  {
    id: 'us-county-names',
    type: 'symbol',
    source: 'us-county-centroids',
    minzoom: 7,
    layout: { 'text-field': ['get', 'NAME'] },
    paint: {
      'text-halo-color': '#fff',
      'text-halo-width': 0.5,
    },
  },
];

function App() {
  //const dispatch = useDispatch();
  //useEffect(() => dispatch(fetchUsCovidByCounty()));
  //dispatch(fetchUsCasesByCounty());
  const [activeLayers, setActiveLayers] = useState(
    layers.map((layer) => layer.id)
  );
  const updateActiveLayers = useCallback(
    (layerId) => {
      const currentState = activeLayers.includes(layerId);
      setActiveLayers(
        currentState
          ? activeLayers.filter((item) => item !== layerId)
          : [...activeLayers, layerId]
      );
    },
    [activeLayers]
  );
  return (
    <>
      <Legend
        layers={layers}
        activeLayers={activeLayers}
        updateActiveLayers={updateActiveLayers}
      />
      <FullscreenMap layers={layers} activeLayers={activeLayers} />
    </>
  );
}

export default App;
