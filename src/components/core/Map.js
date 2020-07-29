import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import { last } from 'lodash';

import { fetchUsCasesByCounty } from '../../workflows/fetchCovidData.js';

mapboxgl.accessToken =
  'pk.eyJ1IjoicnVva3ZsIiwiYSI6ImNrZDA3NW9oNTBhanYyeXBjOXBjazloazUifQ.qwtn31dojyeKrFMrcRAjBw';

const MapboxMap = ({ activeLayers, layers, date, ...props }) => {
  const [lat, setLat] = useState(39);
  const [lng, setLng] = useState(-95);
  const [zoom, setZoom] = useState(3);
  const [map, setMap] = useState(null);
  const [casesByCounty, setCasesByCounty] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const mapContainer = useRef(null);

  useMemo(() => {
    if (map) {
      layers.forEach((layer) =>
        map.setLayoutProperty(
          layer.id,
          'visibility',
          activeLayers.includes(layer.id) ? 'visible' : 'none'
        )
      );
    }
  }, [layers, activeLayers]);

  const updateFeatureState = useMemo(() => {
    if (casesByCounty) {
      for (const [key, value] of Object.entries(casesByCounty)) {
        const recentData = last(value.filter((status) => status.date <= date));
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
    }
  }, [date, casesByCounty, map]);

  useEffect(() => {
    if (map) {
      map.on('sourcedata', (e) => {
        if (e.sourceId === 'us-counties' && e.isSourceLoaded) {
          console.debug('initialized');
          setInitialized(true);
        }
      });
    }
  }, [map]);

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
      const initializeFeatureState = async () => {
        setCasesByCounty(await dataPromise);
      };
      initializeFeatureState();
    });
  }, []);
  return (
    <>
      {!initialized && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            margin: '0 auto',
            zIndex: 100,
            width: '100%',
            textAlign: 'center',
            fontSize: '2em',
            textShadow: '0px 0px 2px #00e',
          }}
        >
          Initializing...
        </div>
      )}
      <div ref={mapContainer} {...props} />
    </>
  );
};

MapboxMap.propTypes = {
  activeLayers: PropTypes.array,
  layers: PropTypes.array,
  date: PropTypes.string,
};

export default MapboxMap;
