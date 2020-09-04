import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import mapboxgl from 'mapbox-gl';
import { findLast, get } from 'lodash';

import {
  setHold,
  setSelectedFeature,
  beginMapInitialization,
  beginLoadingMap,
  mapFinishedLoading,
  beginLoadingSources,
  sourcesFinishedLoading,
  setHoveredFeatures,
} from '../../state/ui/map.js';
import { loadingStatus } from '../../state/util/loadingStatus.js';

import { sourceAdmin0 } from '../../mapboxConfig.js';

mapboxgl.accessToken =
  'pk.eyJ1IjoicnVva3ZsIiwiYSI6ImNrZDA3NW9oNTBhanYyeXBjOXBjazloazUifQ.qwtn31dojyeKrFMrcRAjBw';

const centroidState = (twoWeeksBefore, population) => (state, date) => {
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
    perCapitaHotspot:
      (parseInt(get(recentData, 'cases', 0)) -
        parseInt(get(twoWeeksPrior, 'cases', 0))) /
        parseInt(population) >
      0.01,
  };
};

const choroplethState = (population) => (state, date) => {
  const recentData = findLast(state, (status) => status.date <= date);
  return {
    casesPerCapita:
      population > 0 ? parseInt(get(recentData, 'cases', 0)) / population : 0,
    deathsPerCapita:
      population > 0 ? parseInt(get(recentData, 'deaths', 0)) / population : 0,
    cases: parseInt(get(recentData, 'cases', 0)),
    deaths: parseInt(get(recentData, 'deaths', 0)),
    deathRate:
      parseInt(get(recentData, 'deaths', 0)) /
      parseInt(get(recentData, 'cases', 0)),
    population: population,
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
      id: featureId,
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
  const map = useSelector((state) => state.ui.map.map);
  const initialized = useSelector(
    (state) => state.ui.map.sourcesLoadStatus.status === loadingStatus.complete
  );
  const usPopulation = useSelector(
    (state) => state.core.usCovidData.population
  );
  const worldPopulation = useSelector(
    (state) => state.core.worldCovidData.population
  );
  const selectedGroup = useSelector((state) => state.ui.map.selectedLayerGroup);
  const hoveredFeatures = useSelector((state) => state.ui.map.hoveredFeatures);
  const worldData = useSelector((state) => state.core.worldCovidData.byCountry);
  const activeView = useSelector((state) => state.ui.map.activeView);
  const population =
    activeView.name.toLowerCase() === 'world' ? worldPopulation : usPopulation;

  const mapContainer = useRef(null);

  const filteredActiveLayers = activeLayers.filter((layer) =>
    selectedGroup.layers.includes(layer)
  );
  useEffect(() => {
    if (map && initialized) {
      layers.forEach((layer) => {
        if (map.getLayer(layer.id)) {
          map.setLayoutProperty(
            layer.id,
            'visibility',
            filteredActiveLayers.includes(layer.id) &&
              worldData &&
              casesByCounty
              ? 'visible'
              : 'none'
          );
        }
      });
    }
  }, [
    map,
    initialized,
    layers,
    filteredActiveLayers,
    worldData,
    casesByCounty,
  ]);

  useEffect(() => {
    const lat = 39;
    const lng = -95;
    const zoom = 3;
    dispatch(beginMapInitialization());
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom,
      minZoom: 3,
    });
    if (process.env.NODE_ENV !== 'production') mapboxgl.clearStorage();
    dispatch(beginLoadingMap(map));
  }, [dispatch]);

  useEffect(() => {
    if (map) {
      map.on('load', async () => {
        dispatch(mapFinishedLoading());
        dispatch(beginLoadingSources());
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
          if (init) {
            map.off('sourcedata', detectLoadedSources);
            dispatch(sourcesFinishedLoading());
          }
        };
        map.on('sourcedata', detectLoadedSources);
      });
    }
  }, [map, sources, layers, dispatch]);

  useEffect(() => {
    if (map && initialized) {
      layers.forEach((layer) => {
        if (map.getLayer(layer.id)) map.removeLayer(layer.id);
        map.addLayer(layer);
        map.setLayoutProperty(layer.id, 'visibility', 'none');
      });
    }
  }, [layers, map, initialized]);

  useEffect(() => {
    if (initialized && worldData) {
      /*const twoWeeksAgo = moment(date)
        .subtract(2, 'weeks')
        .format('YYYY-MM-DD');*/
      for (const [key, value] of Object.entries(worldData)) {
        setFeatureState(
          map,
          key,
          ...Object.values(sourceAdmin0),
          value,
          date,
          choroplethState(
            parseInt(get(population, [key, 'POPESTIMATE2019'], 0))
          )
        );
        /*setFeatureState(
          map,
          key,
          'us-county-centroids',
          undefined,
          value,
          date,
          centroidState(
            twoWeeksAgo,
            parseInt(get(population, [key, 'POPESTIMATE2019'], 0))
          )
        );*/
      }
    }
  }, [initialized, date, worldData, map, population]);

  useEffect(() => {
    if (initialized && casesByCounty) {
      const twoWeeksAgo = moment(date)
        .subtract(2, 'weeks')
        .format('YYYY-MM-DD');
      for (const [key, value] of Object.entries(casesByCounty)) {
        setFeatureState(
          map,
          parseInt(key),
          'us-counties',
          'us-counties-500k-a4l482',
          value,
          date,
          choroplethState(
            parseInt(get(population, [key, 'POPESTIMATE2019'], 0))
          )
        );
        setFeatureState(
          map,
          parseInt(key),
          'us-county-centroids',
          undefined,
          value,
          date,
          centroidState(
            twoWeeksAgo,
            parseInt(get(population, [key, 'POPESTIMATE2019'], 0))
          )
        );
      }
    }
  }, [initialized, date, casesByCounty, map, population]);

  const selectFeature = useCallback(
    (theMap, sourceConfig, featureId, selected, hold = false) => {
      if (featureId != null) {
        theMap.setFeatureState(
          {
            ...sourceConfig.source,
            id: featureId,
          },
          { active: selected, hold }
        );
      }
    },
    []
  );

  const selectNewFeature = useCallback(
    (theMap, sourceConfig, featureId, hold) => {
      if (featureId !== selectedFeature) {
        selectFeature(theMap, sourceConfig, selectedFeature, false, hold);
      }
      if (featureId != null) {
        selectFeature(theMap, sourceConfig, featureId, true, hold);
      }
      dispatch(setSelectedFeature(featureId));
    },
    [dispatch, selectFeature, selectedFeature]
  );

  const onMouseUp = useCallback(
    (sourceConfig) => (e) => {
      if (map && initialized) {
        const theFeature = e.features.find(
          (feature) => feature.layer.id === sourceConfig.layer
        );
        if (theFeature.id === undefined) {
          selectNewFeature(map, sourceConfig, null, false);
          dispatch(setHold(false));
        } else if (selectedFeature !== theFeature.id) {
          selectNewFeature(map, sourceConfig, theFeature.id, true);
          dispatch(setHold(true));
        } else {
          selectNewFeature(map, sourceConfig, theFeature.id, !hold);
          dispatch(setHold(!hold));
        }
      }
    },
    [map, initialized, hold, selectNewFeature, dispatch, selectedFeature]
  );

  const onMouseMove = useCallback(
    (sourceConfig) => (e) => {
      if (map && initialized && !hold) {
        let removeFeatures = hoveredFeatures.slice(0, -1);
        removeFeatures.forEach((feature) =>
          selectFeature(map, sourceConfig, feature, false)
        );
        let newArray = [...hoveredFeatures.slice(-1)];
        dispatch(setHoveredFeatures(newArray));
        if (e.features.length > 0) {
          const theFeature = e.features.find(
            (feature) => feature.layer.id === sourceConfig.layer
          );
          dispatch(setHoveredFeatures(newArray.concat([theFeature.id])));
          selectNewFeature(map, sourceConfig, theFeature.id);
        }
      }
    },
    [
      map,
      initialized,
      hold,
      hoveredFeatures,
      dispatch,
      selectNewFeature,
      selectFeature,
    ]
  );

  const onMouseLeave = useCallback(
    (sourceConfig) => () => {
      if (map && initialized && !hold) {
        selectNewFeature(map, sourceConfig, null);
      }
    },
    [map, initialized, hold, selectNewFeature]
  );

  const usBase = {
    layer: 'us-counties-base',
    source: {
      source: 'us-counties',
      sourceLayer: 'us-counties-500k-a4l482',
    },
  };
  const onMouseUpUs = onMouseUp(usBase);
  const onMouseMoveUs = onMouseMove(usBase);
  const onMouseLeaveUs = onMouseLeave(usBase);

  const worldBase = {
    layer: 'countries-base',
    source: {
      source: sourceAdmin0.source,
      sourceLayer: sourceAdmin0['source-layer'],
    },
  };
  const onMouseUpWorld = onMouseUp(worldBase);
  const onMouseMoveWorld = onMouseMove(worldBase);
  const onMouseLeaveWorld = onMouseLeave(worldBase);

  useEffect(() => {
    if (map && initialized) {
      map.on('mouseup', usBase.layer, onMouseUpUs);
      map.on('mousemove', usBase.layer, onMouseMoveUs);
      map.on('mouseleave', usBase.layer, onMouseLeaveUs);
    }
    return () => {
      if (map && initialized) {
        map.off('mouseup', usBase.layer, onMouseUpUs);
        map.off('mousemove', usBase.layer, onMouseMoveUs);
        map.off('mouseleave', usBase.layer, onMouseLeaveUs);
      }
    };
  }, [
    map,
    initialized,
    onMouseUpUs,
    onMouseMoveUs,
    onMouseLeaveUs,
    usBase.layer,
  ]);

  useEffect(() => {
    if (map && initialized) {
      map.on('mouseup', worldBase.layer, onMouseUpWorld);
      map.on('mousemove', worldBase.layer, onMouseMoveWorld);
      map.on('mouseleave', worldBase.layer, onMouseLeaveWorld);
    }
    return () => {
      if (map && initialized) {
        map.off('mouseup', worldBase.layer, onMouseUpWorld);
        map.off('mousemove', worldBase.layer, onMouseMoveWorld);
        map.off('mouseleave', worldBase.layer, onMouseLeaveWorld);
      }
    };
  }, [
    map,
    initialized,
    onMouseUpWorld,
    onMouseMoveWorld,
    onMouseLeaveWorld,
    worldBase.layer,
  ]);

  return <div ref={mapContainer} {...props} />;
};

MapboxMap.propTypes = {
  activeLayers: PropTypes.array,
  sources: PropTypes.array,
  layers: PropTypes.array,
  date: PropTypes.string,
  casesByCounty: PropTypes.object,
};

export default MapboxMap;
