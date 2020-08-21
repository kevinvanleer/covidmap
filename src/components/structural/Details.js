import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get, findLast, set, isEmpty } from 'lodash';
import { Flexbox, Spacer, Text, SquareButton } from 'kvl-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlagUsa } from '@fortawesome/free-solid-svg-icons';

import { Stats } from './Stats.js';
import AreaChart from '../core/d3AreaChart.js';

import { releaseHold, setSelectedFeature } from '../../state/ui/map.js';

export const Details = ({ date, entity, collapsed }) => {
  const dispatch = useDispatch();
  const selectedFeature = useSelector((state) => state.ui.map.selectedFeature);
  const populations = useSelector((state) => state.core.usCovidData.population);
  const population = populations[selectedFeature];
  const data = entity.data;
  let recentData = null;
  let deathRate = {};
  let newCases = 0;
  let ongoingCases = 0;

  if (!isEmpty(data)) {
    recentData = findLast(
      data,
      (status) => status.date <= date.format('YYYY-MM-DD')
    ) || { deaths: 0, cases: 0 };
    const yesterday = findLast(
      data,
      (status) =>
        status.date <= moment(date).subtract(1, 'days').format('YYYY-MM-DD')
    );
    const twoWeekLagData = findLast(
      data,
      (status) =>
        status.date <= moment(date).subtract(2, 'weeks').format('YYYY-MM-DD')
    );
    const fourWeekLagData = findLast(
      data,
      (status) =>
        status.date <= moment(date).subtract(4, 'weeks').format('YYYY-MM-DD')
    );
    const eightWeekLagData = findLast(
      data,
      (status) =>
        status.date <= moment(date).subtract(8, 'weeks').format('YYYY-MM-DD')
    );
    set(deathRate, 'current', recentData.deaths / recentData.cases);
    set(
      deathRate,
      'twoWeek',
      recentData.deaths / get(twoWeekLagData, 'cases') || 0
    );
    set(
      deathRate,
      'fourWeek',
      recentData.deaths / get(fourWeekLagData, 'cases') || 0
    );
    set(
      deathRate,
      'eightWeek',
      recentData.deaths / get(eightWeekLagData, 'cases') || 0
    );
    newCases = get(recentData, 'cases', 0) - get(yesterday, 'cases', 0);
    ongoingCases =
      get(recentData, 'cases', 0) - get(twoWeekLagData, 'cases', 0);
  } else {
    recentData = {
      date: '2020-01-01',
      cases: 0,
      deaths: 0,
    };
    deathRate = {
      current: 0,
      twoWeek: 0,
      fourWeek: 0,
      eightWeek: 0,
    };
  }

  const closeStats = useCallback(() => {
    dispatch(releaseHold());
    dispatch(setSelectedFeature(null));
  }, [dispatch]);

  return recentData ? (
    <Flexbox flexDirection="column">
      <Flexbox inline>
        <Flexbox flexDirection="column">
          <Text bold fontSize="label">
            {entity.displayName}
          </Text>
          <Text fontSize="detail">
            {recentData.date
              ? `reporting on ${recentData.date}`
              : 'no reported cases'}
          </Text>
          <Spacer height="0.5em" />
          <Stats
            population={population}
            deathRate={deathRate}
            collapsed={collapsed}
            entity={entity}
            recentData={recentData}
            newCases={newCases}
            ongoingCases={ongoingCases}
          />
        </Flexbox>
        <Spacer flexGrow={1} />
        {selectedFeature != null ? (
          <SquareButton
            id="covid19-button-close-stats"
            onClick={closeStats}
            backgroundColor="#777"
          >
            <FontAwesomeIcon color="#eee" icon={faFlagUsa} fixedWidth />
          </SquareButton>
        ) : null}
      </Flexbox>
      <AreaChart
        data={data}
        currentDate={date}
        height={collapsed ? 100 : undefined}
        currentValue={parseInt(get(recentData, 'cases', 0))}
        showIntercept={true}
      />
    </Flexbox>
  ) : null;
};

Details.propTypes = {
  date: PropTypes.object,
  entity: PropTypes.object,
  collapsed: PropTypes.bool,
};
