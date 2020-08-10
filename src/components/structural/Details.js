import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get, findLast, set, isEmpty } from 'lodash';
import { Flexbox, Spacer, Text } from 'kvl-ui';

import AreaChart from '../core/d3AreaChart.js';

const Stats = ({ collapsed, entity, deathRate, recentData }) => {
  return !collapsed ? (
    <>
      <Text>{`First case: ${get(entity.data, [1, 'date'])}`}</Text>
      <Text>{`cases: ${new Intl.NumberFormat('en-US').format(
        get(recentData, 'cases', 0)
      )}`}</Text>
      <Text>{`deaths: ${new Intl.NumberFormat('en-US').format(
        get(recentData, 'deaths', 0)
      )}`}</Text>
      <Text>{`death rate:
          ${(deathRate.current * 100).toFixed()}% /
          ${(deathRate.twoWeek * 100).toFixed()}% /
          ${(deathRate.fourWeek * 100).toFixed()}% /
          ${(deathRate.eightWeek * 100).toFixed()}%`}</Text>
    </>
  ) : null;
};

export const Details = ({ date, entity, collapsed }) => {
  const data = entity.data;
  let recentData = null;
  let deathRate = {};

  if (!isEmpty(data)) {
    recentData = findLast(
      data,
      (status) => status.date <= date.format('YYYY-MM-DD')
    ) || { deaths: 0, cases: 0 };
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

  return recentData ? (
    <Flexbox flexDirection="column">
      <Text fontSize="label">{entity.displayName}</Text>
      <Text fontSize="detail">{`reporting on ${recentData.date}`}</Text>
      <Spacer height="0.5em" />
      <Stats
        deathRate={deathRate}
        collapsed={collapsed}
        entity={entity}
        recentData={recentData}
      />
      <AreaChart
        data={data}
        currentDate={date}
        height={collapsed ? 100 : undefined}
        currentValue={parseInt(get(recentData, 'cases', 0))}
      />
    </Flexbox>
  ) : null;
};

Details.propTypes = {
  date: PropTypes.object,
  entity: PropTypes.object,
  collapsed: PropTypes.bool,
};
