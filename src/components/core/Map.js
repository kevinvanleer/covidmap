import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';
import { last } from 'lodash';

mapboxgl.accessToken =
  'pk.eyJ1IjoicnVva3ZsIiwiYSI6ImNrZDA3NW9oNTBhanYyeXBjOXBjazloazUifQ.qwtn31dojyeKrFMrcRAjBw';

const MapboxMap = ({
  sources,
  activeLayers,
  layers,
  date,
  selectedFeature,
  setSelectedFeature,
  casesByCounty,
  ...props
}) => {
  const [map, setMap] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const mapContainer = useRef(null);

  useMemo(() => {
    if (map && initialized) {
      layers.forEach((layer) =>
        map.setLayoutProperty(
          layer.id,
          'visibility',
          activeLayers.includes(layer.id) ? 'visible' : 'none'
        )
      );
    }
  }, [map, initialized, layers, activeLayers]);

  useEffect(() => {
    const lat = 39;
    const lng = -95;
    const zoom = 3;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom,
    });
    setMap(map);
    map.on('load', () => {
      sources.forEach((source) => map.addSource(source.id, source.config));
      layers.forEach((layer) => map.addLayer(layer));
      map.on('sourcedata', () =>
        setInitialized(
          sources.reduce(
            (loaded, source) => loaded && map.isSourceLoaded(source.id),
            true
          )
        )
      );
    });
  }, [sources, layers]);

  useEffect(() => {
    if (initialized && casesByCounty) {
      for (const [key, value] of Object.entries(casesByCounty)) {
        const recentData = last(value.filter((status) => status.date <= date));
        map.setFeatureState(
          {
            source: 'us-counties',
            id: parseInt(key),
          },
          {
            cases: recentData ? parseInt(recentData.cases) : 0,
            deaths: recentData ? parseInt(recentData.deaths) : 0,
          }
        );
      }
    }
  }, [initialized, date, casesByCounty, map]);

  useEffect(() => {
    if (map && initialized) {
      map.on('mousemove', 'us-counties-base', (e) => {
        if (e.features.length > 0) {
          if (selectedFeature) {
            map.setFeatureState(
              { source: 'us-counties', id: selectedFeature },
              { active: false }
            );
          }
          const theFeature = e.features.find(
            (feature) => feature.layer.id === 'us-counties-base'
          );
          setSelectedFeature(theFeature.id);
          map.setFeatureState(
            { source: 'us-counties', id: parseInt(theFeature.id) },
            { active: true }
          );
        }
      });
      map.on('mouseleave', 'us-counties-base', () => {
        if (selectedFeature) {
          map.setFeatureState(
            { source: 'us-counties', id: selectedFeature },
            { active: false }
          );
        }
        setSelectedFeature(null);
      });
    }
  }, [map, selectedFeature, setSelectedFeature, initialized]);

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
          Rendering visualization...
        </div>
      )}
      <div ref={mapContainer} {...props} />
    </>
  );
};

MapboxMap.propTypes = {
  activeLayers: PropTypes.array,
  sources: PropTypes.array,
  layers: PropTypes.array,
  date: PropTypes.string,
  selectedFeature: PropTypes.number,
  setSelectedFeature: PropTypes.func,
  casesByCounty: PropTypes.object,
};

export default MapboxMap;
