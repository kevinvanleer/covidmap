import React, { useEffect, useRef } from 'react';
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
} from '../../state/ui/map.js';
import { loadingStatus } from '../../state/util/loadingStatus.js';

import {
  sourceAdmin0,
  sourceUsCounties,
  sourceUsStates,
  mouseLayers,
} from '../../mapboxConfig.js';

mapboxgl.accessToken =
  'pk.eyJ1IjoicnVva3ZsIiwiYSI6ImNrZDA3NW9oNTBhanYyeXBjOXBjazloazUifQ.qwtn31dojyeKrFMrcRAjBw';

const centroidState = (twoWeeksBefore, population) => (state, date) => {
  const recentData = findLast(state, (status) => status.date <= date.end);
  const twoWeeksPrior = findLast(
    state,
    (status) => status.date <= twoWeeksBefore
  );
  return {
    firstCase: get(state, [1, 'date']) === date.end,
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
  const recentData = findLast(state, (status) => status.date <= date.end);
  const beginRangeData = date.start
    ? findLast(state, (status) => status.date <= date.start)
    : null;
  const beginCases = date.start ? parseInt(get(beginRangeData, 'cases', 0)) : 0;
  const beginDeaths = date.start
    ? parseInt(get(beginRangeData, 'deaths', 0))
    : 0;
  const cases = parseInt(get(recentData, 'cases', 0)) - beginCases;
  const deaths = parseInt(get(recentData, 'deaths', 0)) - beginDeaths;

  return {
    casesPerCapita: population > 0 ? cases / population : 0,
    deathsPerCapita: population > 0 ? deaths / population : 0,
    cases: cases,
    deaths: deaths,
    deathRate: deaths / cases,
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

const selectFeature = (
  theMap,
  sourceConfig,
  featureId,
  selected,
  hold = false
) => {
  if (featureId != null) {
    theMap.setFeatureState(
      {
        ...sourceConfig.source,
        id: featureId,
      },
      { active: selected, hold }
    );
  }
};

const MapboxMap = ({ sources, activeLayers, layers, date, ...props }) => {
  const dispatch = useDispatch();
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
  const usData = useSelector((state) => state.core.usCovidData.stateAndCounty);
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
            filteredActiveLayers.includes(layer.id) && worldData && usData
              ? 'visible'
              : 'none'
          );
        }
      });
    }
  }, [map, initialized, layers, filteredActiveLayers, worldData, usData]);

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
      maxPitch: 0,
      dragRotate: false,
      touchPitch: false,
      pitchWithRotate: false,
    });
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
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
    if (initialized && usData) {
      const twoWeeksAgo = moment(date.end)
        .subtract(2, 'weeks')
        .format('YYYY-MM-DD');
      for (const [key, value] of Object.entries(usData)) {
        if (key.length <= 2) {
          setFeatureState(
            map,
            key,
            ...Object.values(sourceUsStates),
            value,
            date,
            choroplethState(
              parseInt(get(population, [key, 'POPESTIMATE2019'], 0))
            )
          );
        } else {
          setFeatureState(
            map,
            key,
            ...Object.values(sourceUsCounties),
            value,
            date,
            choroplethState(
              parseInt(get(population, [key, 'POPESTIMATE2019'], 0))
            )
          );
          setFeatureState(
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
          );
        }
      }
    }
  }, [initialized, date, usData, map, population]);

  useEffect(() => {
    let selectedFeature = null;
    let hold = null;
    const selectNewFeature = (theMap, sourceConfig, featureId, newHold) => {
      if (featureId !== selectedFeature) {
        selectFeature(theMap, sourceConfig, selectedFeature, false, newHold);
        selectedFeature = featureId;
        dispatch(setSelectedFeature(featureId));
      }
      if (featureId != null) {
        selectFeature(theMap, sourceConfig, featureId, true, newHold);
      }
    };

    const onMouseUp = (sourceConfig) => (e) => {
      if (map && initialized) {
        const theFeature = e.features.find(
          (feature) => feature.layer.id === sourceConfig.layer
        );
        if (theFeature.id === undefined) {
          selectNewFeature(map, sourceConfig, null, false);
          dispatch(setHold(false));
          hold = false;
        } else if (selectedFeature !== theFeature.id) {
          selectNewFeature(map, sourceConfig, theFeature.id, true);
          dispatch(setHold(true));
          hold = true;
        } else {
          selectNewFeature(map, sourceConfig, theFeature.id, !hold);
          dispatch(setHold(!hold));
          hold = !hold;
        }
      }
    };

    const onMouseMove = (sourceConfig) => (e) => {
      if (map && initialized && !hold) {
        if (e.features.length > 0) {
          const theFeature = e.features.find(
            (feature) => feature.layer.id === sourceConfig.layer
          );
          selectNewFeature(map, sourceConfig, theFeature.id);
        }
      }
    };

    const onMouseLeave = (sourceConfig) => () => {
      if (map && initialized && !hold) {
        selectNewFeature(map, sourceConfig, null);
      }
    };

    const handlers = [];
    mouseLayers.forEach((base) => {
      if (map && initialized) {
        let handler = {
          event: 'mouseup',
          layer: base.layer,
          handler: onMouseUp(base),
        };
        map.on(handler.event, handler.layer, handler.handler);
        handlers.push({ ...handler });

        handler = {
          event: 'mousemove',
          layer: base.layer,
          handler: onMouseMove(base),
        };
        map.on(handler.event, handler.layer, handler.handler);
        handlers.push({ ...handler });

        handler = {
          event: 'mouseleave',
          layer: base.layer,
          handler: onMouseLeave(base),
        };
        map.on(handler.event, handler.layer, handler.handler);
        handlers.push({ ...handler });
      }
    });
    return () => {
      handlers.forEach((handler) => {
        map.off(handler.event, handler.layer, handler.handler);
      });
    };
  }, [map, initialized, dispatch]);

  return <div ref={mapContainer} {...props} />;
};

MapboxMap.propTypes = {
  activeLayers: PropTypes.array,
  sources: PropTypes.array,
  layers: PropTypes.array,
  date: PropTypes.object,
};

export default MapboxMap;
