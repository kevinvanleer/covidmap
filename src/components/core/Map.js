import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import { last } from 'lodash';

import { fetchUsCasesByCounty } from '../../workflows/fetchCovidData.js';

mapboxgl.accessToken =
  'pk.eyJ1IjoicnVva3ZsIiwiYSI6ImNrZDA3NW9oNTBhanYyeXBjOXBjazloazUifQ.qwtn31dojyeKrFMrcRAjBw';

const MapboxMap = ({ activeLayers, layers, ...props }) => {
  const [lat, setLat] = useState(39);
  const [lng, setLng] = useState(-95);
  const [zoom, setZoom] = useState(3);
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    const dataPromise = fetchUsCasesByCounty();
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom,
    });
    setMap(map);
    map.on('load', () => {
      map.addSource('us-counties', {
        type: 'geojson',
        data: '/api/us-geo-cases-by-county',
      });
      map.addSource('us-county-centroids', {
        type: 'geojson',
        data: '/api/us-county-centroids',
      });

      layers.forEach((layer) => map.addLayer(layer));

      layers.forEach((layer) =>
        map.setLayoutProperty(
          layer.id,
          'visibility',
          activeLayers.includes(layer.id) ? 'visible' : 'none'
        )
      );
      const updateFeatureState = async () => {
        const casesByCounty = await dataPromise;
        for (const [key, value] of Object.entries(casesByCounty)) {
          //const recentData = last(value);
          const recentData = last(
            value.filter((status) => status.date <= '2020-07-30')
          );
          map.setFeatureState(
            {
              source: 'us-counties',
              id: key,
            },
            {
              cases: recentData ? parseInt(recentData.cases) : 0,
              deaths: recentData ? parseInt(recentData.deaths) : 0,
            }
          );
        }
      };
      updateFeatureState();
    });
  }, []);
  return <div ref={mapContainer} {...props} />;
};

MapboxMap.propTypes = {
  activeLayers: PropTypes.array,
  layers: PropTypes.array,
};

export default MapboxMap;
