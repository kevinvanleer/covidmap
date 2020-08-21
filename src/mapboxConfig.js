import {
  faSkullCrossbones,
  faVirus,
  faViruses,
  faHeadSideCough,
} from '@fortawesome/free-solid-svg-icons';

export const legendConfig = {
  deaths: {
    name: 'Deaths',
    color: '#f00',
    gradient: [
      {
        magnitude: 10,
        opacity: 0.2,
      },
      {
        magnitude: 100,
        opacity: 0.4,
      },
      {
        magnitude: 1000,
        opacity: 0.7,
      },
      {
        magnitude: 2000,
        opacity: 0.8,
      },
    ],
  },
  cases: {
    name: 'Cases',
    color: '#00f',
    gradient: [
      {
        magnitude: 10,
        opacity: 0.1,
      },
      {
        magnitude: 100,
        opacity: 0.2,
      },
      {
        magnitude: 10000,
        opacity: 0.4,
      },
      {
        magnitude: 200000,
        opacity: 0.8,
      },
    ],
  },
  deathsPerCapita: {
    name: 'Deaths',
    color: '#f00',
    gradient: [
      {
        magnitude: '.01%',
        opacity: 0.1,
      },
      {
        magnitude: '.02%',
        opacity: 0.2,
      },
      {
        magnitude: '.1%',
        opacity: 0.5,
      },
      {
        magnitude: '1%',
        opacity: 0.8,
      },
    ],
  },
  casesPerCapita: {
    name: 'Cases',
    color: '#00f',
    gradient: [
      {
        magnitude: '.1%',
        opacity: 0.1,
      },
      {
        magnitude: '.2%',
        opacity: 0.2,
      },
      {
        magnitude: '1%',
        opacity: 0.5,
      },
      {
        magnitude: '5%',
        opacity: 0.8,
      },
    ],
  },
};

export const sources = [
  {
    id: 'us-counties',
    config: {
      type: 'vector',
      url: 'mapbox://ruokvl.0761cl0n',
      promoteId: 'FEATURE_ID',
    },
  },
  {
    id: 'us-county-centroids',
    config: {
      type: 'geojson',
      data: '/api/us-county-centroids',
    },
  },
];
export const layers = [
  {
    legend: {
      label: 'Deaths',
      icon: faSkullCrossbones,
      fillColor: legendConfig.deathsPerCapita.color,
      gradient: legendConfig.deathsPerCapita.gradient,
    },
    id: 'us-county-per-capita-deaths',
    type: 'fill',
    source: 'us-counties',
    'source-layer': 'us-counties-500k-a4l482',
    paint: {
      'fill-color': '#f00',
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['feature-state', 'deathsPerCapita'],
        0,
        0,
        0.0001,
        0.1,
        0.0002,
        0.2,
        0.001,
        0.5,
        0.003,
        0.7,
        0.005,
        0.8,
        1,
        0.8,
      ],
    },
  },
  {
    legend: {
      label: 'Cases',
      icon: faHeadSideCough,
      fillColor: legendConfig.casesPerCapita.color,
      gradient: legendConfig.casesPerCapita.gradient,
    },
    id: 'us-county-per-capita-cases',
    type: 'fill',
    source: 'us-counties',
    'source-layer': 'us-counties-500k-a4l482',
    paint: {
      'fill-color': '#00f',
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['feature-state', 'casesPerCapita'],
        0,
        0,
        0.001,
        0.1,
        0.002,
        0.2,
        0.01,
        0.5,
        0.03,
        0.7,
        0.05,
        0.8,
        1,
        0.8,
      ],
    },
  },
  {
    legend: {
      label: 'Deaths',
      icon: faSkullCrossbones,
      fillColor: legendConfig.deaths.color,
      gradient: legendConfig.deaths.gradient,
    },
    id: 'us-county-total-deaths',
    type: 'fill',
    source: 'us-counties',
    'source-layer': 'us-counties-500k-a4l482',
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
        0.4,
        1000,
        0.7,
        2000,
        0.8,
        10000000,
        0.8,
      ],
    },
  },
  {
    legend: {
      label: 'Cases',
      icon: faHeadSideCough,
      fillColor: legendConfig.cases.color,
      gradient: legendConfig.cases.gradient,
    },
    id: 'us-county-total-cases',
    type: 'fill',
    source: 'us-counties',
    'source-layer': 'us-counties-500k-a4l482',
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
        0.4,
        100000,
        0.7,
        200000,
        0.8,
        10000000,
        0.8,
      ],
    },
  },
  {
    id: 'us-counties-base',
    type: 'fill',
    source: 'us-counties',
    'source-layer': 'us-counties-500k-a4l482',
    paint: {
      'fill-color': 'transparent',
    },
  },
  {
    id: 'us-counties-outline-base',
    type: 'line',
    source: 'us-counties',
    'source-layer': 'us-counties-500k-a4l482',
    paint: {
      'line-color': ['case', ['feature-state', 'hold'], '#0f0', '#e842dc'],
      'line-width': ['interpolate', ['linear'], ['zoom'], 3, 2, 10, 4],
      'line-opacity': ['to-number', ['feature-state', 'active']],
    },
  },
  {
    legend: {
      label: 'Hotspots',
      icon: faViruses,
    },
    id: 'us-hotspots',
    type: 'symbol',
    source: 'us-county-centroids',
    layout: {
      'icon-image': 'corona-red',
      'icon-size': ['interpolate', ['linear'], ['zoom'], 3, 0.1, 20, 1],
      'icon-ignore-placement': true,
    },
    paint: {
      'icon-opacity': ['to-number', ['feature-state', 'hotspot']],
      'icon-color': 'red',
    },
  },
  {
    legend: {
      label: 'Hotspots',
      icon: faViruses,
    },
    id: 'us-per-capita-hotspots',
    type: 'symbol',
    source: 'us-county-centroids',
    layout: {
      'icon-image': 'corona-red',
      'icon-size': ['interpolate', ['linear'], ['zoom'], 3, 0.1, 20, 1],
      'icon-ignore-placement': true,
    },
    paint: {
      'icon-opacity': ['to-number', ['feature-state', 'perCapitaHotspot']],
      'icon-color': 'red',
    },
  },
  {
    legend: {
      label: 'Onset',
      icon: faVirus,
    },
    id: 'us-first-case',
    type: 'symbol',
    source: 'us-county-centroids',
    layout: {
      'icon-image': 'corona-green',
      'icon-size': ['interpolate', ['linear'], ['zoom'], 3, 0.3, 20, 1],
      'icon-ignore-placement': true,
    },
    paint: {
      'icon-opacity': ['to-number', ['feature-state', 'firstCase']],
      'icon-color': 'red',
    },
  },
  {
    id: 'us-county-names',
    type: 'symbol',
    source: 'us-county-centroids',
    minzoom: 7,
    layout: { 'text-field': ['get', 'NAME'], 'text-ignore-placement': true },
    paint: {
      'text-halo-color': '#fff',
      'text-halo-width': 1,
    },
  },
];

const getUniversalLayers = () =>
  layers.filter((layer) => layer.legend === undefined).map((layer) => layer.id);

export const layerGroups = [
  {
    name: 'Per Capita',
    layers: [
      'us-county-per-capita-deaths',
      'us-county-per-capita-cases',
      'us-per-capita-hotspots',
      'us-first-case',
      ...getUniversalLayers(),
    ],
  },
  {
    name: 'Total',
    layers: [
      'us-county-total-deaths',
      'us-county-total-cases',
      'us-hotspots',
      'us-first-case',
      ...getUniversalLayers(),
    ],
  },
];
