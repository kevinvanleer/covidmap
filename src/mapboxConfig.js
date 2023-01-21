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

const casesColor = '#00f';
const deathsColor = '#f00';
const populationColor = '#0f0';
const invalidColor = '#777';

const usCountyTotalDeathsUpperBound = 1e5;
const usCountyTotalCasesUpperBound = 5e6;
const usCountyPopulationUpperBound = 1e7;
const usStateTotalUpperBound = 1e8;
const usStatePopulationUpperBound = 5e8;
const usStateInfectionRateUpperBound = 1;
const worldPerCapitaCasesUpperBound = 0.5;
const worldPerCapitaDeathsUpperBound = 0.02;
const worldPopulationUpperBound = 1e9;
const worldTotalUpperBound = 1e8;

const cubicBezierDefaultControlPoints = [0.0, 1.0, 0.2, 0.9];
const worldPerCapitaBezierControlPoints = [0.0, 0.5, 0.3, 0.6];
const worldTotalControlPoints = cubicBezierDefaultControlPoints;

const generateAnchorPoints = (upperLimit) => [
  0,
  0,
  upperLimit,
  0.8,
  upperLimit * 1000,
  0.8,
];

const convertPoints = (anchors, controls) => {
  return [
    { x: anchors[0], y: anchors[1] },
    { x: controls[0] * anchors[2], y: controls[1] * anchors[3] },
    { x: controls[2] * anchors[2], y: controls[3] * anchors[3] },
    { x: anchors[2], y: anchors[3] },
  ];
};

const legendLabelPercent = (magnitude) => `${magnitude * 100}%`;

const legendLabelMagnitude = (number) => {
  if (number >= 1e9) {
    return `${number / 1e9}B`;
  }
  if (number >= 1e6) {
    return `${number / 1e6}M`;
  }
  if (number >= 1e3) {
    return `${number / 1e3}k`;
  }
  return number;
};

const getLinearOpacity = (upperLimit) => (magnitude) => magnitude / upperLimit;

const generateLegendGradient = (
  upperLimit,
  legendLabelFunc,
  steps,
  opacityFunc
) =>
  steps.map((step) => ({
    magnitude: legendLabelFunc(upperLimit * step),
    opacity: opacityFunc(upperLimit * step),
  }));

const worldTotalAnchorPoints = generateAnchorPoints(worldTotalUpperBound);

const usStateTotalAnchorPoints = generateAnchorPoints(usStateTotalUpperBound);

const usCountyPopulationAnchorPoints = generateAnchorPoints(
  usCountyPopulationUpperBound
);

const usCountyTotalDeathsAnchorPoints = generateAnchorPoints(
  usCountyTotalDeathsUpperBound
);
const usCountyTotalCasesAnchorPoints = generateAnchorPoints(
  usCountyTotalCasesUpperBound
);

const worldPerCapitaAnchorPoints = generateAnchorPoints(
  worldPerCapitaCasesUpperBound
);
const perCapitaDeathsAnchorPoints = generateAnchorPoints(
  worldPerCapitaDeathsUpperBound
);

const infectionRateAnchorPoints = generateAnchorPoints(
  usStateInfectionRateUpperBound
);

const usStatePopulationAnchorPoints = generateAnchorPoints(
  usStatePopulationUpperBound
);

const getWorldPerCapitaLegendOpacity = cubicBezierFindY(
  ...convertPoints(
    worldPerCapitaAnchorPoints,
    worldPerCapitaBezierControlPoints
  )
);

const getPerCapitaDeathsLegendOpacity = cubicBezierFindY(
  ...convertPoints(
    perCapitaDeathsAnchorPoints,
    worldPerCapitaBezierControlPoints
  )
);

const getUsCountyTotalCasesLegendOpacity = cubicBezierFindY(
  ...convertPoints(
    usCountyTotalCasesAnchorPoints,
    worldPerCapitaBezierControlPoints
  )
);

const getUsCountyTotalDeathsLegendOpacity = cubicBezierFindY(
  ...convertPoints(
    usCountyTotalDeathsAnchorPoints,
    worldPerCapitaBezierControlPoints
  )
);

const getUsStateTotalLegendOpacity = cubicBezierFindY(
  ...convertPoints(usStateTotalAnchorPoints, cubicBezierDefaultControlPoints)
);

const getUsStatePopulationLegendOpacity = cubicBezierFindY(
  ...convertPoints(
    usStatePopulationAnchorPoints,
    cubicBezierDefaultControlPoints
  )
);

const getWorldTotalLegendOpacity = cubicBezierFindY(
  ...convertPoints(worldTotalAnchorPoints, cubicBezierDefaultControlPoints)
);

const getUsCountyPopulationLegendOpacity = cubicBezierFindY(
  ...convertPoints(
    usCountyPopulationAnchorPoints,
    cubicBezierDefaultControlPoints
  )
);

const worldPopulationAnchorPoints = generateAnchorPoints(
  worldPopulationUpperBound
);

const getWorldPopLegendOpacity = cubicBezierFindY(
  ...convertPoints(worldPopulationAnchorPoints, cubicBezierDefaultControlPoints)
);

const usStateTotalGradient = generateLegendGradient(
  usStateTotalUpperBound,
  legendLabelMagnitude,
  [1e-3, 1e-2, 1e-1, 1],
  getUsStateTotalLegendOpacity
);

const worldPerCapitaGradient = generateLegendGradient(
  worldPerCapitaCasesUpperBound,
  legendLabelPercent,
  [0.1, 0.25, 0.5, 1],
  getWorldPerCapitaLegendOpacity
);

const perCapitaDeathsGradient = generateLegendGradient(
  worldPerCapitaDeathsUpperBound,
  legendLabelPercent,
  [0.1, 0.25, 0.5, 1],
  getPerCapitaDeathsLegendOpacity
);

const worldTotalsGradient = generateLegendGradient(
  worldTotalUpperBound,
  legendLabelMagnitude,
  [1e-3, 1e-2, 1e-1, 1],
  getWorldTotalLegendOpacity
);

const worldPopulationGradient = generateLegendGradient(
  worldPopulationUpperBound,
  legendLabelMagnitude,
  [1e-3, 1e-2, 1e-1, 1],
  getWorldPopLegendOpacity
);

const usMiscLegendConfig = {
  covidVsFlu: {
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
    fillColor: '#ff9a00',
    gradient: generateLegendGradient(
      usStateInfectionRateUpperBound,
      legendLabelPercent,
      [0.1, 0.2, 0.5, 1],
      getLinearOpacity(usStateInfectionRateUpperBound)
    ),
  },
};

const usLegendConfig = {
  ...usMiscLegendConfig,
  population: {
    defaultDisabled: true,
    fillColor: populationColor,
    gradient: generateLegendGradient(
      usCountyPopulationUpperBound,
      legendLabelMagnitude,
      [1e-3, 1e-2, 1e-1, 1],
      getUsCountyPopulationLegendOpacity
    ),
  },
  statePopulation: {
    defaultDisabled: true,
    fillColor: populationColor,
    gradient: generateLegendGradient(
      usStatePopulationUpperBound,
      legendLabelMagnitude,
      [1e-3, 1e-2, 1e-1, 1],
      getUsStatePopulationLegendOpacity
    ),
  },
  usStateTotalCases: {
    fillColor: casesColor,
    gradient: usStateTotalGradient,
  },
  usStateTotalDeaths: {
    fillColor: deathsColor,
    gradient: usStateTotalGradient,
  },
  deaths: {
    fillColor: deathsColor,
    gradient: generateLegendGradient(
      usCountyTotalDeathsUpperBound,
      legendLabelMagnitude,
      [1e-3, 1e-2, 1e-1, 1],
      getUsCountyTotalDeathsLegendOpacity
    ),
  },
  cases: {
    fillColor: casesColor,
    gradient: generateLegendGradient(
      //1e6,
      usCountyTotalCasesUpperBound,
      legendLabelMagnitude,
      [1e-3, 1e-2, 1e-1, 1],
      getUsCountyTotalCasesLegendOpacity
    ),
  },
};

const legendConfig = {
  ...usMiscLegendConfig,
  ...usLegendConfig,
};

export const sourceAdmin0 = {
  source: 'admin-levels',
  'source-layer': 'admin0',
};

export const sourceUsStates = {
  source: 'us-admin-levels',
  'source-layer': 'admin1',
};

export const sourceUsCounties = {
  source: 'us-admin-levels',
  'source-layer': 'admin2',
};

export const mouseLayers = [];

const generateBaseLayers = (source, prefix) => {
  mouseLayers.push({
    source: {
      source: source.source,
      sourceLayer: source['source-layer'],
    },
    layer: `${prefix}-base`,
  });
  return [
    {
      id: `${prefix}-base`,
      type: 'fill',
      ...source,
      paint: {
        'fill-color': 'transparent',
      },
    },
    {
      id: `${prefix}-outline-base`,
      type: 'line',
      ...source,
      paint: {
        'line-color': [
          'case',
          ['feature-state', 'hold'],
          populationColor,
          '#e842dc',
        ],
        'line-width': ['interpolate', ['linear'], ['zoom'], 3, 2, 10, 4],
        'line-opacity': ['to-number', ['feature-state', 'active']],
      },
    },
  ];
};

const worldLayers = [
  {
    id: 'world-per-capita-cases',
    type: 'fill',
    ...sourceAdmin0,
    legend: {
      label: 'Cases',
      icon: faHeadSideCough,
      fillColor: casesColor,
      gradient: worldPerCapitaGradient,
    },
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'casesPerCapita'], null],
        invalidColor,
        casesColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...worldPerCapitaBezierControlPoints],
        ['feature-state', 'casesPerCapita'],
        ...worldPerCapitaAnchorPoints,
      ],
    },
  },
  {
    id: 'world-per-capita-deaths',
    legend: {
      label: 'Deaths',
      icon: faSkullCrossbones,
      fillColor: deathsColor,
      gradient: perCapitaDeathsGradient,
    },
    type: 'fill',
    ...sourceAdmin0,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'deathsPerCapita'], null],
        invalidColor,
        deathsColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...worldPerCapitaBezierControlPoints],
        ['feature-state', 'deathsPerCapita'],
        ...perCapitaDeathsAnchorPoints,
      ],
    },
  },
  {
    id: 'world-cases',
    type: 'fill',
    ...sourceAdmin0,
    legend: {
      label: 'Cases',
      icon: faHeadSideCough,
      fillColor: casesColor,
      gradient: worldTotalsGradient,
    },
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'cases'], null],
        invalidColor,
        casesColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...worldTotalControlPoints],
        ['feature-state', 'cases'],
        ...worldTotalAnchorPoints,
      ],
    },
  },
  {
    id: 'world-deaths',
    legend: {
      label: 'Deaths',
      icon: faSkullCrossbones,
      fillColor: deathsColor,
      gradient: worldTotalsGradient,
    },
    type: 'fill',
    ...sourceAdmin0,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'deaths'], null],
        invalidColor,
        deathsColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...worldTotalControlPoints],
        ['feature-state', 'deaths'],
        ...worldTotalAnchorPoints,
      ],
    },
  },
  ...generateBaseLayers(sourceAdmin0, 'countries'),
  {
    legend: {
      label: 'Population',
      icon: faUsers,
      defaultDisabled: true,
      fillColor: populationColor,
      gradient: worldPopulationGradient,
    },
    id: 'world-country-population',
    type: 'fill',
    ...sourceAdmin0,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'population'], null],
        invalidColor,
        populationColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', 0.0, 1.0, 0.3, 0.6],
        ['feature-state', 'population'],
        ...worldPopulationAnchorPoints,
      ],
    },
  },
];

const usLayersState = [
  {
    legend: {
      label: 'Cases vs Avg',
      icon: faBiohazard,
      ...legendConfig.covidVsAvg,
      zoomLevels: [Number.NEGATIVE_INFINITY, 4],
    },
    id: 'us-state-cases-vs-avg',
    type: 'fill',
    ...sourceUsStates,
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
      zoomLevels: [Number.NEGATIVE_INFINITY, 4],
    },
    id: 'us-state-deaths-vs-avg',
    type: 'fill',
    ...sourceUsStates,
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
      zoomLevels: [Number.NEGATIVE_INFINITY, 4],
    },
    id: 'us-state-deaths-vs-flu',
    type: 'fill',
    ...sourceUsStates,
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
      zoomLevels: [Number.NEGATIVE_INFINITY, 4],
    },
    id: 'us-state-cases-vs-flu',
    type: 'fill',
    ...sourceUsStates,
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
      zoomLevels: [Number.NEGATIVE_INFINITY, 4],
    },
    id: 'us-state-infection-rate',
    type: 'fill',
    ...sourceUsStates,
    paint: {
      'fill-color': legendConfig.infectionRate.fillColor,
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['feature-state', 'casesPerCapita'],
        ...infectionRateAnchorPoints,
      ],
    },
  },
  {
    legend: {
      label: 'Deaths',
      icon: faSkullCrossbones,
      fillColor: deathsColor,
      gradient: perCapitaDeathsGradient,
      zoomLevels: [Number.NEGATIVE_INFINITY, 4],
    },
    id: 'us-state-per-capita-deaths',
    type: 'fill',
    ...sourceUsStates,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'deathsPerCapita'], null],
        invalidColor,
        deathsColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...worldPerCapitaBezierControlPoints],
        ['feature-state', 'deathsPerCapita'],
        ...perCapitaDeathsAnchorPoints,
      ],
    },
  },
  {
    legend: {
      label: 'Cases',
      icon: faHeadSideCough,
      fillColor: casesColor,
      gradient: worldPerCapitaGradient,
      zoomLevels: [Number.NEGATIVE_INFINITY, 4],
    },
    id: 'us-state-per-capita-cases',
    type: 'fill',
    ...sourceUsStates,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'casesPerCapita'], null],
        invalidColor,
        casesColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...worldPerCapitaBezierControlPoints],
        ['feature-state', 'casesPerCapita'],
        ...worldPerCapitaAnchorPoints,
      ],
    },
  },
  {
    legend: {
      label: 'Deaths',
      icon: faSkullCrossbones,
      ...legendConfig.usStateTotalDeaths,
      zoomLevels: [Number.NEGATIVE_INFINITY, 4],
    },
    id: 'us-state-total-deaths',
    type: 'fill',
    ...sourceUsStates,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'deaths'], null],
        invalidColor,
        deathsColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...cubicBezierDefaultControlPoints],
        ['feature-state', 'deaths'],
        ...usStateTotalAnchorPoints,
      ],
    },
  },
  {
    legend: {
      label: 'Cases',
      icon: faHeadSideCough,
      ...legendConfig.usStateTotalCases,
      zoomLevels: [Number.NEGATIVE_INFINITY, 4],
    },
    id: 'us-state-total-cases',
    type: 'fill',
    ...sourceUsStates,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'cases'], null],
        invalidColor,
        casesColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...cubicBezierDefaultControlPoints],
        ['feature-state', 'cases'],
        ...usStateTotalAnchorPoints,
      ],
    },
  },
  {
    legend: {
      label: 'Population',
      icon: faUsers,
      ...legendConfig.statePopulation,
      defaultDisabled: true,
      zoomLevels: [Number.NEGATIVE_INFINITY, 4],
    },
    id: 'us-state-population',
    type: 'fill',
    ...sourceUsStates,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'population'], null],
        invalidColor,
        populationColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', 0.0, 1.0, 0.2, 0.9],
        ['feature-state', 'population'],
        ...usStatePopulationAnchorPoints,
      ],
    },
  },
  ...generateBaseLayers(sourceUsStates, 'us-states'),
  /*{
    legend: {
      label: 'Hotspots',
      icon: faViruses,
    },
    id: 'us-hotspots',
    type: 'symbol',
    source: 'us-state-centroids',
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
    source: 'us-state-centroids',
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
    source: 'us-state-centroids',
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
    id: 'us-state-names',
    type: 'symbol',
    source: 'us-state-centroids',
    minzoom: 7,
    layout: { 'text-field': ['get', 'NAME'], 'text-ignore-placement': true },
    paint: {
      'text-halo-color': '#fff',
      'text-halo-width': 1,
    },
  },*/
];
const usLayersCounty = [
  {
    legend: {
      label: 'Cases vs Avg',
      icon: faBiohazard,
      ...legendConfig.covidVsAvg,
      zoomLevels: [4, Number.POSITIVE_INFINITY],
    },
    id: 'us-county-cases-vs-avg',
    type: 'fill',
    ...sourceUsCounties,
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
      zoomLevels: [4, Number.POSITIVE_INFINITY],
    },
    id: 'us-county-deaths-vs-avg',
    type: 'fill',
    ...sourceUsCounties,
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
      zoomLevels: [4, Number.POSITIVE_INFINITY],
    },
    id: 'us-county-deaths-vs-flu',
    type: 'fill',
    ...sourceUsCounties,
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
      zoomLevels: [4, Number.POSITIVE_INFINITY],
    },
    id: 'us-county-cases-vs-flu',
    type: 'fill',
    ...sourceUsCounties,
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
      zoomLevels: [4, Number.POSITIVE_INFINITY],
    },
    id: 'us-county-infection-rate',
    type: 'fill',
    ...sourceUsCounties,
    paint: {
      'fill-color': legendConfig.infectionRate.fillColor,
      'fill-opacity': [
        'interpolate',
        ['linear'],
        ['feature-state', 'casesPerCapita'],
        ...infectionRateAnchorPoints,
      ],
    },
  },
  {
    legend: {
      label: 'Deaths',
      icon: faSkullCrossbones,
      fillColor: deathsColor,
      gradient: perCapitaDeathsGradient,
      zoomLevels: [4, Number.POSITIVE_INFINITY],
    },
    id: 'us-county-per-capita-deaths',
    type: 'fill',
    ...sourceUsCounties,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'deathsPerCapita'], null],
        invalidColor,
        deathsColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...worldPerCapitaBezierControlPoints],
        ['feature-state', 'deathsPerCapita'],
        ...perCapitaDeathsAnchorPoints,
      ],
    },
  },
  {
    legend: {
      label: 'Cases',
      icon: faHeadSideCough,
      fillColor: casesColor,
      gradient: worldPerCapitaGradient,
      zoomLevels: [4, Number.POSITIVE_INFINITY],
    },
    id: 'us-county-per-capita-cases',
    type: 'fill',
    ...sourceUsCounties,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'casesPerCapita'], null],
        invalidColor,
        casesColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...worldPerCapitaBezierControlPoints],
        ['feature-state', 'casesPerCapita'],
        ...worldPerCapitaAnchorPoints,
      ],
    },
  },
  {
    legend: {
      label: 'Deaths',
      icon: faSkullCrossbones,
      ...legendConfig.deaths,
      zoomLevels: [4, Number.POSITIVE_INFINITY],
    },
    id: 'us-county-total-deaths',
    type: 'fill',
    ...sourceUsCounties,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'deaths'], null],
        invalidColor,
        deathsColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...worldPerCapitaBezierControlPoints],
        ['feature-state', 'deaths'],
        ...usCountyTotalDeathsAnchorPoints,
      ],
    },
  },
  {
    legend: {
      label: 'Cases',
      icon: faHeadSideCough,
      ...legendConfig.cases,
      zoomLevels: [4, Number.POSITIVE_INFINITY],
    },
    id: 'us-county-total-cases',
    type: 'fill',
    ...sourceUsCounties,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'cases'], null],
        invalidColor,
        casesColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', ...worldPerCapitaBezierControlPoints],
        ['feature-state', 'cases'],
        ...usCountyTotalCasesAnchorPoints,
      ],
    },
  },
  {
    legend: {
      label: 'Population',
      icon: faUsers,
      ...legendConfig.population,
      zoomLevels: [4, Number.POSITIVE_INFINITY],
    },
    id: 'us-county-population',
    type: 'fill',
    ...sourceUsCounties,
    paint: {
      'fill-color': [
        'case',
        ['==', ['feature-state', 'population'], null],
        invalidColor,
        populationColor,
      ],
      'fill-opacity': [
        'interpolate',
        ['cubic-bezier', 0.0, 1.0, 0.2, 0.9],
        ['feature-state', 'population'],
        ...usCountyPopulationAnchorPoints,
      ],
    },
  },
  ...generateBaseLayers(sourceUsCounties, 'us-counties'),
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
    id: 'admin-levels',
    config: {
      type: 'vector',
      url: 'mapbox://ruokvl.admin-levels',
      promoteId: 'ISO_A2',
    },
  },
  {
    id: 'us-admin-levels',
    config: {
      type: 'vector',
      url: 'mapbox://ruokvl.us-admin-levels',
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

const usLayers = [...usLayersState, ...usLayersCounty];
export const layers = [...worldLayers, ...usLayers];

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
        'us-state-per-capita-deaths',
        'us-state-per-capita-cases',
        'us-per-capita-hotspots',
        'us-first-case',
        'us-county-population',
        'us-state-population',
        ...getUsCommonLayers(),
      ],
    },
    {
      name: 'Total',
      layers: [
        'us-county-total-deaths',
        'us-county-total-cases',
        'us-state-total-deaths',
        'us-state-total-cases',
        'us-hotspots',
        'us-first-case',
        ...getUsCommonLayers(),
      ],
    },
    {
      name: 'Misc',
      layers: [
        'us-county-infection-rate',
        //'us-county-cases-vs-flu',
        //'us-county-cases-vs-avg',
        //'us-county-deaths-vs-flu',
        //'us-county-deaths-vs-avg',
        'us-per-capita-hotspots',
        'us-county-population',
        'us-state-infection-rate',
        //'us-state-cases-vs-flu',
        //'us-state-cases-vs-avg',
        //'us-state-deaths-vs-flu',
        //'us-state-deaths-vs-avg',
        'us-per-capita-hotspots',
        'us-state-population',
        ...getUsCommonLayers(),
      ],
    },
  ],
  world: [
    {
      name: 'Per Capita',
      layers: [
        'world-per-capita-deaths',
        'world-per-capita-cases',
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
