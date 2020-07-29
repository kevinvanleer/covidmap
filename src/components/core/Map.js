import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1IjoicnVva3ZsIiwiYSI6ImNrZDA3NW9oNTBhanYyeXBjOXBjazloazUifQ.qwtn31dojyeKrFMrcRAjBw';

const MapboxMap = ({ ...props }) => {
  const [lat, setLat] = useState(30);
  const [lng, setLng] = useState(-90);
  const [zoom, setZoom] = useState(3);
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom,
    });
    map.on('load', () => {
      map.addSource('us-counties', {
        type: 'geojson',
        data: 'gz_2010_us_050_00_500k.json',
      });
      console.debug('adding source');
      map.addLayer({
        id: 'us-counties',
        type: 'fill',
        source: 'us-counties',
        paint: {
          'fill-color': '#00f',
        },
      });
      setMap(map);
    });
  }, []);
  return <div ref={mapContainer} {...props} />;
};

export default MapboxMap;
