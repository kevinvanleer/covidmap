import {
  faSkullCrossbones,
  faVirus,
  faViruses,
  faHeadSideCough,
  faBiohazard,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

/*
const fluCasesEst2019 = 35.5e6;
const fluDeathsEst2019 = 34200;
const fluCasesPerCapita = 35.5 / 328.2;
const fluDeathsPerCapita = 34200 / 328.2e6;
*/

import { cubicBezierFindY } from './util/bezier.js';

const worldPerCapitaBezierControlPoints = [0.0, 1.0, 0.3, 0.6];
const worldPerCapitaAnchorPoints = [0, 0, 0.05, 0.8, 1, 0.8];

const convertPoints = (anchors, controls) => {
  return [
    { x: anchors[0], y: anchors[1] },
    { x: controls[0] * anchors[2], y: controls[1] * anchors[3] },
    { x: controls[2] * anchors[2], y: controls[3] * anchors[3] },
    { x: anchors[2], y: anchors[3] },
  ];
};

const getWorldPerCapitaLegendOpacity = cubicBezierFindY(
  ...convertPoints(
    worldPerCapitaAnchorPoints,
    worldPerCapitaBezierControlPoints
  )
);
const getWorldLegendOpacity = cubicBezierFindY(
  { x: 0, y: 0 },
  { x: 0, y: 0.8 },
  { x: 2e6, y: 0.72 },
  { x: 1e7, y: 0.8 }
);
const getWorldPopLegendOpacity = cubicBezierFindY(
  { x: 0, y: 0 },
  { x: 0, y: 0.8 },
  { x: 3e8, y: 0.48 },
  { x: 1e9, y: 0.8 }
);

const worldPerCapitaGradient = [
  {
    magnitude: '.1%',
    opacity: getWorldPerCapitaLegendOpacity(0.001),
  },
  {
    magnitude: '.2%',
    opacity: getWorldPerCapitaLegendOpacity(0.002),
  },
  {
    magnitude: '1%',
    opacity: getWorldPerCapitaLegendOpacity(0.01),
  },
  {
    magnitude: '5%',
    opacity: getWorldPerCapitaLegendOpacity(0.05),
  },
];

const worldTotalsGradient = [
  {
    magnitude: 1e4,
    opacity: getWorldLegendOpacity(1e4),
  },
  {
    magnitude: 1e5,
    opacity: getWorldLegendOpacity(1e5),
  },
  {
    magnitude: 1e6,
    opacity: getWorldLegendOpacity(1e6),
  },
  {
    magnitude: 1e7,
    opacity: 0.8,
  },
];

const worldLegendConfig = {
  worldDeathsPerCapita: {
    name: 'Deaths',
    defaultDisabled: false,
    fillColor: '#f00',
    gradient: worldPerCapitaGradient,
  },
  worldCasesPerCapita: {
    name: 'Cases',
    defaultDisabled: false,
    fillColor: '#00f',
    gradient: worldPerCapitaGradient,
  },
  worldDeaths: {
    name: 'Deaths',
    fillColor: '#f00',
    gradient: worldTotalsGradient,
  },
  worldCases: {
    name: 'Cases',
    fillColor: '#00f',
    gradient: worldTotalsGradient,
  },
  worldPopulation: {
    name: 'Population',
    defaultDisabled: true,
    fillColor: '#0f0',
    gradient: [
      {
        magnitude: 1e6,
        opacity: getWorldPopLegendOpacity(1e6),
      },
      {
        magnitude: 1e7,
        opacity: getWorldPopLegendOpacity(1e7),
      },
      {
        magnitude: 1e8,
        opacity: getWorldPopLegendOpacity(1e8),
      },
      {
        magnitude: 1e9,
        opacity: 0.8,
      },
    ],
  },
};

const worldLayers = [
  {
    id: 'world-cases-per-capita',
    type: 'fill',
    source: 'world-countries',
    legend: {
      label: 'Cases',
      icon: faHeadSideCough,
      ...legendConfig.worldCasesPerCapita,
    },
    'source-layer': 'countries-4bm4v0',
    paint: {
      'fill-color': '#00f',
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...worldPerCapitaBezierControlPoints],
        ['feature-state', 'casesPerCapita'],
        ...worldPerCapitaAnchorPoints,
      ],
    },
  },
  {
    id: 'world-deaths-per-capita',
    legend: {
      label: 'Deaths',
      icon: faSkullCrossbones,
      ...legendConfig.worldDeathsPerCapita,
    },
    type: 'fill',
    source: 'world-countries',
    'source-layer': 'countries-4bm4v0',
    paint: {
      'fill-color': '#f00',
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...worldPerCapitaBezierControlPoints],
        ['feature-state', 'deathsPerCapita'],
        ...worldPerCapitaAnchorPoints,
      ],
    },
  },
  {
    id: 'world-cases',
    type: 'fill',
    source: 'world-countries',
    legend: {
      label: 'Cases',
      icon: faHeadSideCough,
      ...legendConfig.worldCases,
    },
    'source-layer': 'countries-4bm4v0',
    paint: {
      'fill-color': '#00f',
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', 0.0, 1.0, 0.2, 0.9],
        ['feature-state', 'cases'],
        0,
        0,
        1e7,
        0.8,
        1,
        0.8,
      ],
    },
  },
  {
    id: 'world-deaths',
    legend: {
      label: 'Deaths',
      icon: faSkullCrossbones,
      ...legendConfig.worldDeaths,
    },
    type: 'fill',
    source: 'world-countries',
    'source-layer': 'countries-4bm4v0',
    paint: {
      'fill-color': '#f00',
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', 0.0, 1.0, 0.2, 0.9],
        ['feature-state', 'deaths'],
        0,
        0,
        1e7,
        0.8,
        1e10,
        0.8,
      ],
    },
  },
  {
    id: 'countries-base',
    type: 'fill',
    source: 'world-countries',
    'source-layer': 'countries-4bm4v0',
    paint: {
      'fill-color': 'transparent',
    },
  },
  {
    id: 'countries-outline-base',
    type: 'line',
    source: 'world-countries',
    'source-layer': 'countries-4bm4v0',
    paint: {
      'line-color': ['case', ['feature-state', 'hold'], '#0f0', '#e842dc'],
      'line-width': ['interpolate', ['linear'], ['zoom'], 3, 2, 10, 4],
      'line-opacity': ['to-number', ['feature-state', 'active']],
    },
  },
  {
    legend: {
      label: 'Population',
      icon: faUsers,
      ...legendConfig.worldPopulation,
    },
    id: 'world-country-population',
    type: 'fill',
    source: 'world-countries',
    'source-layer': 'countries-4bm4v0',
    paint: {
      'fill-color': '#0f0',
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', 0.0, 1.0, 0.3, 0.6],
        ['feature-state', 'population'],
        0,
        0,
        1e9,
        0.8,
        1e14,
        0.8,
      ],
    },
  },
];

const usMiscLegendConfig = {
  covidVsFlu: {
    name: 'COVID vs Flu',
    mutex: true,
    gradient: [
      {
        magnitude: 'FLU',
        opacity: 0.8,
        fillColor: '#3bebff',
      },
      {
        magnitude: '',
        opacity: 0.4,
        fillColor: '#3bebff',
      },
      {
        magnitude: '0',
        fillColor: '#ffd400',
        opacity: 0,
      },
      {
        magnitude: '',
        fillColor: '#ffd400',
        opacity: 0.4,
      },
      {
        magnitude: 'CVD',
        fillColor: '#ffd400',
        opacity: 0.8,
      },
    ],
  },
  covidVsAvg: {
    name: 'COVID vs Avg',
    mutex: true,
    gradient: [
      {
        magnitude: 'LOW',
        opacity: 0.8,
        fillColor: '#3bebff',
      },
      {
        magnitude: '',
        opacity: 0.4,
        fillColor: '#3bebff',
      },
      {
        magnitude: 'AVG',
        fillColor: '#ffd400',
        opacity: 0,
      },
      {
        magnitude: '',
        fillColor: '#ffd400',
        opacity: 0.4,
      },
      {
        magnitude: 'HIGH',
        fillColor: '#ffd400',
        opacity: 0.8,
      },
    ],
  },
  infectionRate: {
    name: 'Infection Rate',
    fillColor: '#ff9a00',
    gradient: [
      {
        magnitude: '1%',
        opacity: 0.1,
      },
      {
        magnitude: '5%',
        opacity: 0.5,
      },
      {
        magnitude: '10%',
        opacity: 0.7,
      },
      {
        magnitude: '20%',
        opacity: 0.8,
      },
    ],
  },
};

const usLegendConfig = {
  ...worldLegendConfig,
  ...usMiscLegendConfig,
  population: {
    name: 'Population',
    defaultDisabled: true,
    fillColor: '#0f0',
    gradient: [
      {
        magnitude: 1e4,
        opacity: getWorldLegendOpacity(1e4),
      },
      {
        magnitude: 1e5,
        opacity: getWorldLegendOpacity(1e5),
      },
      {
        magnitude: 1e6,
        opacity: getWorldLegendOpacity(1e6),
      },
      {
        magnitude: 1e7,
        opacity: 0.8,
      },
    ],
  },
  deaths: {
    name: 'Deaths',
    fillColor: '#f00',
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
    fillColor: '#00f',
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
    fillColor: '#f00',
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
    fillColor: '#00f',
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

const usLayers = [
  {
    legend: {
      label: 'Cases vs Avg',
      icon: faBiohazard,
      ...legendConfig.covidVsAvg,
    },
    id: 'us-county-cases-vs-avg',
    type: 'fill',
    source: 'us-counties',
    'source-layer': 'us-counties-500k-a4l482',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['feature-state', 'casesPerCapita'],
        0,
        ['rgba', 58, 235, 255, 0.8],
        0.0018,
        ['rgba', 58, 235, 255, 0.8],
        0.01799,
        ['rgba', 58, 235, 255, 0],
        0.018,
        ['rgba', 255, 212, 0, 0],
        0.18,
        ['rgba', 255, 212, 0, 0.8],
        1,
        ['rgba', 255, 212, 0, 0.8],
      ],
    },
  },
  {
    legend: {
      label: 'Deaths vs Avg',
      icon: faBiohazard,
      ...legendConfig.covidVsAvg,
    },
    id: 'us-county-deaths-vs-avg',
    type: 'fill',
    source: 'us-counties',
    'source-layer': 'us-counties-500k-a4l482',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['feature-state', 'deathsPerCapita'],
        0,
        ['rgba', 58, 235, 255, 0.8],
        5.6e-5,
        ['rgba', 58, 235, 255, 0.8],
        5.599e-4,
        ['rgba', 58, 235, 255, 0],
        5.6e-4,
        ['rgba', 255, 212, 0, 0],
        5.6e-3,
        ['rgba', 255, 212, 0, 0.8],
        1,
        ['rgba', 255, 212, 0, 0.8],
      ],
    },
  },
  {
    legend: {
      label: 'Deaths vs Flu',
      icon: faBiohazard,
      ...legendConfig.covidVsFlu,
    },
    id: 'us-county-deaths-vs-flu',
    type: 'fill',
    source: 'us-counties',
    'source-layer': 'us-counties-500k-a4l482',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['feature-state', 'deathsPerCapita'],
        0,
        ['rgba', 58, 235, 255, 0.8],
        1e-5,
        ['rgba', 58, 235, 255, 0.8],
        9e-5,
        ['rgba', 58, 235, 255, 0],
        1e-4,
        ['rgba', 255, 212, 0, 0],
        1e-3,
        ['rgba', 255, 212, 0, 0.8],
        1,
        ['rgba', 255, 212, 0, 0.8],
      ],
    },
  },
  {
    legend: {
      label: 'Cases vs Flu',
      icon: faBiohazard,
      ...legendConfig.covidVsFlu,
    },
    id: 'us-county-cases-vs-flu',
    type: 'fill',
    source: 'us-counties',
    'source-layer': 'us-counties-500k-a4l482',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['feature-state', 'casesPerCapita'],
        0,
        ['rgba', 58, 235, 255, 0.8],
        0.01,
        ['rgba', 58, 235, 255, 0.8],
        0.09,
        ['rgba', 58, 235, 255, 0],
        0.1,
        ['rgba', 255, 212, 0, 0],
        0.2,
        ['rgba', 255, 212, 0, 0.8],
        1,
        ['rgba', 255, 212, 0, 0.8],
      ],
    },
  },
  {
    legend: {
      label: 'Infection rate',
      icon: faBiohazard,
      ...legendConfig.infectionRate,
    },
    id: 'us-county-infection-rate',
    type: 'fill',
    source: 'us-counties',
    'source-layer': 'us-counties-500k-a4l482',
    paint: {
      'fill-color': legendConfig.infectionRate.fillColor,
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['feature-state', 'casesPerCapita'],
        0,
        0,
        0.01,
        0.1,
        0.02,
        0.2,
        0.05,
        0.5,
        0.1,
        0.7,
        0.2,
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
      ...legendConfig.deathsPerCapita,
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
      ...legendConfig.casesPerCapita,
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
      ...legendConfig.deaths,
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
      ...legendConfig.cases,
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
    legend: {
      label: 'Population',
      icon: faUsers,
      ...legendConfig.population,
    },
    id: 'us-county-population',
    type: 'fill',
    source: 'us-counties',
    'source-layer': 'us-counties-500k-a4l482',
    paint: {
      'fill-color': '#0f0',
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', 0.0, 1.0, 0.2, 0.9],
        ['feature-state', 'population'],
        0,
        0,
        1e7,
        0.8,
        1e10,
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
      'icon-size': ['interpolate', ['linear'], ['zoom'], 3, 0.2, 20, 1],
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

export const sources = [
  {
    id: 'world-countries',
    config: {
      type: 'vector',
      url: 'mapbox://ruokvl.d4p3jnf9',
      promoteId: 'ISO_A2',
    },
  },
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

export const legendConfig = {
  ...worldLegendConfig,
  ...usMiscLegendConfig,
  ...usLegendConfig,
};

export const layers = [...usLayers, ...worldLayers];

const getUsCommonLayers = () =>
  usLayers
    .filter((layer) => layer.legend === undefined)
    .map((layer) => layer.id);

const getWorldCommonLayers = () =>
  worldLayers
    .filter((layer) => layer.legend === undefined)
    .map((layer) => layer.id);

export const getUniversalLayers = () =>
  layers.filter((layer) => layer.legend === undefined).map((layer) => layer.id);

export const layerGroups = {
  us: [
    {
      name: 'Per Capita',
      layers: [
        'us-county-per-capita-deaths',
        'us-county-per-capita-cases',
        'us-per-capita-hotspots',
        'us-first-case',
        'us-county-population',
        ...getUsCommonLayers(),
      ],
    },
    {
      name: 'Total',
      layers: [
        'us-county-total-deaths',
        'us-county-total-cases',
        'us-hotspots',
        'us-first-case',
        ...getUsCommonLayers(),
      ],
    },
    {
      name: 'Misc',
      layers: [
        'us-county-infection-rate',
        'us-county-cases-vs-flu',
        'us-county-cases-vs-avg',
        'us-county-deaths-vs-flu',
        'us-county-deaths-vs-avg',
        'us-per-capita-hotspots',
        'us-county-population',
        ...getUsCommonLayers(),
      ],
    },
  ],
  world: [
    {
      name: 'Per Capita',
      layers: [
        'world-deaths-per-capita',
        'world-cases-per-capita',
        'world-country-population',
        ...getWorldCommonLayers(),
      ],
    },
    {
      name: 'Total',
      layers: [
        'world-deaths',
        'world-cases',
        'world-country-population',
        ...getWorldCommonLayers(),
      ],
    },
  ],
};
