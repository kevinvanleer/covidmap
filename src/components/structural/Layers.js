import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { get, inRange } from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { Flexbox, Spacer } from 'kvl-react-ui';

import { LayerItem } from '../presentation/LayerItem.js';
import { MultiSelect } from './MultiSelect.js';

import {
  updateActiveLayers,
  setActiveLayers,
  selectLayerGroup,
  setActiveView,
} from '../../state/ui/map.js';

import { setTimeRange } from '../../state/core/time.js';

export const Layers = ({ layers, activeLayers, collapsed }) => {
  const dispatch = useDispatch();
  const selectedGroup = useSelector((state) => state.ui.map.selectedLayerGroup);
  const activeView = useSelector((state) => state.ui.map.activeView);
  const views = useSelector((state) => state.ui.map.views);
  const groups = useSelector((state) => state.ui.map.layerGroups);
  const map = useSelector((state) => state.ui.map.map);
  const usStartDate = useSelector((state) => state.core.usCovidData.startDate);
  const usEndDate = useSelector((state) => state.core.usCovidData.endDate);
  const worldStartDate = useSelector(
    (state) => state.core.worldCovidData.startDate
  );
  const worldEndDate = useSelector(
    (state) => state.core.worldCovidData.endDate
  );
  const zoomLevel = map ? map.getZoom() : 0;
  const filteredLayers = useMemo(
    () =>
      layers.filter(
        (layer) =>
          selectedGroup.layers.includes(layer.id) &&
          inRange(
            zoomLevel,
            ...get(layer, 'legend.zoomLevels', [
              Number.NEGATIVE_INFINITY,
              Number.POSITIVE_INFINITY,
            ])
          )
      ),
    [layers, zoomLevel, selectedGroup.layers]
  );

  const onUpdateActiveLayers = useCallback(
    (layer) => {
      if (layer?.legend?.mutex && !activeLayers.includes(layer.id)) {
        const mutexLayers = filteredLayers
          .filter((layer) => layer?.legend?.mutex)
          .map((layer) => layer.id);
        const newLayers = activeLayers.filter(
          (layer) => !mutexLayers.includes(layer)
        );
        dispatch(setActiveLayers(newLayers));
      }
      dispatch(updateActiveLayers(layer.id));
    },
    [dispatch, activeLayers, filteredLayers]
  );

  const onSelectView = useCallback(
    (view) => {
      dispatch(setActiveView(view));
      if (view.name === 'world') {
        dispatch(
          setTimeRange({
            start: worldStartDate,
            end: worldEndDate,
          })
        );
      } else {
        dispatch(
          setTimeRange({
            start: usStartDate,
            end: usEndDate,
          })
        );
      }
    },
    [dispatch, usStartDate, usEndDate, worldStartDate, worldEndDate]
  );
  const onSelectGroup = useCallback(
    (group) => {
      dispatch(selectLayerGroup(group));
    },
    [dispatch]
  );

  return (
    <Flexbox flexDirection="column">
      {!collapsed ? (
        <>
          <MultiSelect
            groups={views}
            selectedGroup={activeView}
            onSelect={onSelectView}
          />
          <MultiSelect
            groups={groups || []}
            selectedGroup={selectedGroup}
            onSelect={onSelectGroup}
          />
          <Spacer height="0.7em" />
        </>
      ) : null}
      <Flexbox flexWrap="wrap" wrapMargin="0.5em">
        {filteredLayers.map((layer) =>
          layer.legend === undefined ? null : (
            <LayerItem
              key={layer.id}
              onClick={() => onUpdateActiveLayers(layer)}
              config={layer.legend}
              active={activeLayers.includes(layer.id)}
              collapsed={collapsed}
            />
          )
        )}
      </Flexbox>
    </Flexbox>
  );
};

Layers.propTypes = {
  layers: PropTypes.array,
  activeLayers: PropTypes.array,
  collapsed: PropTypes.bool,
};
