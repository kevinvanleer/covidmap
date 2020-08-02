export const sources = [
  {
    id: 'us-counties',
    config: {
      type: 'geojson',
      data: '/api/us-counties',
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
