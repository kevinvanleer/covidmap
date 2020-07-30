import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { last } from 'lodash';

import AreaChart from './components/core/d3AreaChart.js';

//import { fetchUsCovidByCounty } from './workflows/fetchCovidData.js';
import { fetchUsCasesByCounty } from './workflows/fetchCovidData.js';

import FullscreenMap from './components/presentation/FullscreenMap.js';

const Details = styled(({ className, info, data }) => (
  <div className={className}>
    <div>{`${info.county}, ${info.state}`}</div>
    <div style={{ height: '0.2em' }} />
    {info.cases > 0 ? (
      <>
        <div>{`cases: ${info.cases}`}</div>
        <div>{`deaths: ${info.deaths}`}</div>
        <div>{`death rate: ${(
          (info.deaths / info.cases) *
          100
        ).toFixed()}%`}</div>
        <AreaChart data={data} />)
      </>
    ) : (
      <div>No cases reported</div>
    )}
  </div>
))`
  position: absolute;
  z-index: 10;
  left: 1em;
  top: 1em;
  background-color: #444;
  color: #eee;
  padding: 1em;
`;
const LegendItem = styled(({ className, onClick, label }) => (
  <div className={className} onClick={onClick}>
    {label}
  </div>
))`
  cursor: pointer;
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
`;

const DateSelector = ({ className, date, setDate }) => (
  <>
    <Slider
      reverse={true}
      min={0}
      max={moment().dayOfYear()}
      onChange={setDate}
    />
    <div className={className}>{date}</div>
  </>
);

const Legend = styled(
  ({ className, layers, activeLayers, updateActiveLayers, date, setDate }) => {
    return (
      <div className={className}>
        <>
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
        </>
        <div style={{ height: '1em' }} />
        <DateSelector date={date} setDate={setDate} />
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
    id: 'us-counties-base',
    legendHide: true,
    type: 'fill',
    source: 'us-counties',
    paint: {
      'fill-outline-color': '#0f0',
      'fill-color': 'rgba(0, 255, 0, 1)',
      'fill-opacity': ['to-number', ['feature-state', 'active']],
    },
  },
  {
    id: 'us-county-names',
    legendHide: true,
    type: 'symbol',
    source: 'us-county-centroids',
    minzoom: 7,
    layout: { 'text-field': ['get', 'NAME'] },
    paint: {
      'text-halo-color': '#fff',
      'text-halo-width': 1,
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
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [casesByCounty, setCasesByCounty] = useState(null);

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

  useEffect(() => {
    const initializeFeatureState = async () => {
      setCasesByCounty(await fetchUsCasesByCounty());
    };
    initializeFeatureState();
  }, []);

  const onSetDate = useCallback((value) => {
    let newDate = moment().subtract(value, 'days');
    setDate(newDate.format('YYYY-MM-DD'));
  });

  let recentData = null;
  if (casesByCounty && selectedFeature) {
    recentData = last(
      casesByCounty[selectedFeature].filter((status) => status.date <= date)
    );
  }
  return (
    <>
      <Legend
        layers={layers}
        activeLayers={activeLayers}
        updateActiveLayers={updateActiveLayers}
        date={date}
        setDate={onSetDate}
      />
      {recentData ? (
        <Details info={recentData} data={casesByCounty[selectedFeature]} />
      ) : null}
      <FullscreenMap
        date={date}
        layers={layers}
        selectedFeature={selectedFeature}
        setSelectedFeature={setSelectedFeature}
        activeLayers={activeLayers}
        casesByCounty={casesByCounty}
      />
    </>
  );
}

export default App;
