import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import { last } from 'lodash';

mapboxgl.accessToken =
  'pk.eyJ1IjoicnVva3ZsIiwiYSI6ImNrZDA3NW9oNTBhanYyeXBjOXBjazloazUifQ.qwtn31dojyeKrFMrcRAjBw';

const MapboxMap = ({ ...props }) => {
  const [lat, setLat] = useState(30);
  const [lng, setLng] = useState(-90);
  const [zoom, setZoom] = useState(3);
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  const casesByCounty = useSelector(
    (state) => state.core.casesByCounty,
    shallowEqual
  );
  console.debug('rendering', casesByCounty);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom,
    });
    setMap(map);
    map.on('load', () => {
      console.debug('map loaded');
      map.addSource('us-county-total-cases', {
        type: 'geojson',
        data: '/api/us-geo-cases-by-county',
      });
      map.addSource('us-county-centroids', {
        type: 'geojson',
        data: '/api/us-county-centroids',
      });
      /*map.addLayer({
        id: 'us-county-total-cases',
        type: 'fill',
        source: 'us-county-total-cases',
        paint: {
          'fill-color': '#f00',
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['get', 'deaths'],
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
      });*/
      map.addLayer({
        id: 'us-county-total-cases',
        type: 'fill',
        source: 'us-county-total-cases',
        paint: {
          'fill-color': '#00f',
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['get', 'cases'],
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
      });
      map.addLayer({
        id: 'us-county-centroids',
        type: 'symbol',
        source: 'us-county-centroids',
        minzoom: 6,
        layout: { 'text-field': ['get', 'NAME'] },
        paint: {
          'text-halo-color': '#fff',
          'text-halo-width': 0.5,
        },
      });
    });
    /*if (casesByCounty) {
      console.debug('setting feature state');
      for (const [key, value] of Object.entries(casesByCounty)) {
        console.debug(key, last(value).cases);
        map.setFeatureState(
          {
            source: 'us-county-total-cases',
            id: key,
          },
          { cases: last(value).cases }
        );
      }
    }*/
  }, [casesByCounty]);
  return <div ref={mapContainer} {...props} />;
};

export default MapboxMap;
