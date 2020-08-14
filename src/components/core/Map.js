import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import mapboxgl from 'mapbox-gl';
import { findLast, get } from 'lodash';

import { setHold, setSelectedFeature } from '../../state/ui/map.js';

mapboxgl.accessToken =
  'pk.eyJ1IjoicnVva3ZsIiwiYSI6ImNrZDA3NW9oNTBhanYyeXBjOXBjazloazUifQ.qwtn31dojyeKrFMrcRAjBw';

const centroidState = (twoWeeksBefore) => (state, date) => {
  const recentData = findLast(state, (status) => status.date <= date);
  const twoWeeksPrior = findLast(
    state,
    (status) => status.date <= twoWeeksBefore
  );
  return {
    firstCase: get(state, [1, 'date']) === date,
    hotspot:
      parseInt(get(recentData, 'cases', 0)) /
        parseInt(get(twoWeeksPrior, 'cases', 0)) >
        1.2 && parseInt(get(recentData, 'cases', 0)) > 100,
  };
};

const choroplethState = (state, date) => {
  const recentData = findLast(state, (status) => status.date <= date);
  return {
    cases: parseInt(get(recentData, 'cases', 0)),
    deaths: parseInt(get(recentData, 'deaths', 0)),
  };
};

const setFeatureState = (
  map,
  featureId,
  mapSource,
  sourceLayer,
  state,
  date,
  stateFunc
) => {
  map.setFeatureState(
    {
      source: mapSource,
      sourceLayer: sourceLayer,
      id: parseInt(featureId),
    },
    stateFunc(state, date)
  );
};

const MapboxMap = ({
  sources,
  activeLayers,
  layers,
  date,
  casesByCounty,
  ...props
}) => {
  const dispatch = useDispatch();
  const hold = useSelector((state) => state.ui.map.hold);
  const selectedFeature = useSelector((state) => state.ui.map.selectedFeature);
  const dataLoaded = useSelector(
    (state) => state.request.usCasesByCounty.success
  );
  const dataProgress = useSelector(
    (state) => state.request.usCasesByCounty.progress
  );
  const [map, setMap] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [hoveredFeatures, setHoveredFeatures] = useState([]);
  const mapContainer = useRef(null);

  useEffect(() => {
    if (map && initialized) {
      layers.forEach((layer) => {
        if (map.getLayer(layer.id)) {
          map.setLayoutProperty(
            layer.id,
            'visibility',
            activeLayers.includes(layer.id) ? 'visible' : 'none'
          );
        }
      });
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
      minZoom: 3,
    });
    setMap(map);
  }, []);

  useEffect(() => {
    if (map) {
      map.on('load', async () => {
        await Promise.all([
          new Promise((resolve, reject) =>
            map.loadImage('/img/coronavirus-green-128.png', (error, image) => {
              if (error) reject(error);
              map.addImage('corona-green', image);
              resolve();
            })
          ),
          new Promise((resolve, reject) =>
            map.loadImage('/img/coronavirus-red-128.png', (error, image) => {
              if (error) reject(error);
              map.addImage('corona-red', image);
              resolve();
            })
          ),
        ]);

        sources.forEach((source) => map.addSource(source.id, source.config));
        const detectLoadedSources = () => {
          const init = sources.reduce(
            (loaded, source) => loaded && map.isSourceLoaded(source.id),
            true
          );
          setInitialized(init);
          if (init) map.off('sourcedata', detectLoadedSources);
        };
        map.on('sourcedata', detectLoadedSources);
      });
    }
  }, [map, sources, layers]);

  useEffect(() => {
    if (map && initialized) {
      layers.forEach((layer) => {
        if (map.getLayer(layer.id)) map.removeLayer(layer.id);
        map.addLayer(layer);
      });
    }
  }, [layers, map, initialized]);

  useEffect(() => {
    if (initialized && casesByCounty) {
      const twoWeeksAgo = moment(date)
        .subtract(2, 'weeks')
        .format('YYYY-MM-DD');
      for (const [key, value] of Object.entries(casesByCounty)) {
        setFeatureState(
          map,
          key,
          'us-counties',
          'us-counties-500k-a4l482',
          value,
          date,
          choroplethState
        );
        setFeatureState(
          map,
          key,
          'us-county-centroids',
          undefined,
          value,
          date,
          centroidState(twoWeeksAgo)
        );
      }
    }
  }, [initialized, date, casesByCounty, map]);

  const selectFeature = useCallback((theMap, featureId, selected) => {
    if (featureId != null) {
      theMap.setFeatureState(
        {
          source: 'us-counties',
          sourceLayer: 'us-counties-500k-a4l482',
          id: featureId,
        },
        { active: selected }
      );
    }
  }, []);

  const selectNewFeature = useCallback(
    (theMap, featureId) => {
      if (featureId !== selectedFeature) {
        selectFeature(theMap, selectedFeature, false);
      }
      if (featureId != null) {
        selectFeature(theMap, featureId, true);
      }
      dispatch(setSelectedFeature(featureId));
    },
    [dispatch, selectFeature, selectedFeature]
  );

  const onMouseUp = useCallback(
    (e) => {
      if (map && initialized) {
        const theFeature = e.features.find(
          (feature) => feature.layer.id === 'us-counties-base'
        );
        if (theFeature.id === undefined) {
          selectNewFeature(map, null);
          dispatch(setHold(false));
        } else if (selectedFeature !== theFeature.id) {
          selectNewFeature(map, parseInt(theFeature.id));
          dispatch(setHold(true));
        } else {
          dispatch(setHold(!hold));
        }
      }
    },
    [map, initialized, hold, selectNewFeature, dispatch, selectedFeature]
  );

  const onMouseMove = useCallback(
    (e) => {
      if (map && initialized && !hold) {
        let removeFeatures = hoveredFeatures.slice(0, -1);
        removeFeatures.forEach((feature) => selectFeature(map, feature, false));
        let newArray = [...hoveredFeatures.slice(-1)];
        setHoveredFeatures(newArray);
        if (e.features.length > 0) {
          const theFeature = e.features.find(
            (feature) => feature.layer.id === 'us-counties-base'
          );
          setHoveredFeatures(newArray.concat([parseInt(theFeature.id)]));
          selectNewFeature(map, parseInt(theFeature.id));
        }
      }
    },
    [
      map,
      initialized,
      hold,
      hoveredFeatures,
      setHoveredFeatures,
      selectNewFeature,
      selectFeature,
    ]
  );

  const onMouseLeave = useCallback(() => {
    if (map && initialized && !hold) {
      selectNewFeature(map, null);
    }
  }, [map, initialized, hold, selectNewFeature]);

  useEffect(() => {
    if (map && initialized) {
      map.on('mouseup', 'us-counties-base', onMouseUp);
      map.on('mousemove', 'us-counties-base', onMouseMove);
      map.on('mouseleave', 'us-counties-base', onMouseLeave);
    }
    return () => {
      if (map && initialized) {
        map.off('mouseup', 'us-counties-base', onMouseUp);
        map.off('mousemove', 'us-counties-base', onMouseMove);
        map.off('mouseleave', 'us-counties-base', onMouseLeave);
      }
    };
  }, [map, initialized, onMouseUp, onMouseMove, onMouseLeave]);

  return (
    <>
      {(!initialized || dataProgress === 0) && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            margin: '0 auto',
            zIndex: 10,
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
  casesByCounty: PropTypes.object,
};

export default MapboxMap;
