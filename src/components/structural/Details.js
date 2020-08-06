import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get, findLast, set, isEmpty } from 'lodash';
import { Flexbox, Spacer, Text } from 'kvl-ui';

import AreaChart from '../core/d3AreaChart.js';

export const Details = ({ date, data }) => {
  let recentData = null;
  let deathRate = {};
  if (!isEmpty(data)) {
    recentData = findLast(
      data,
      (status) => status.date <= date.format('YYYY-MM-DD')
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
      data.filter(
        (status) =>
          status.date <= moment(date).subtract(8, 'weeks').format('YYYY-MM-DD')
      )
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
  }

  return recentData ? (
    <Flexbox
      flexDirection="column"
      position="absolute"
      zIndex={10}
      left="1em"
      top="1em"
      backgroundColor="#444"
      color="#eee"
      padding="1em"
      pointerEvents="none"
    >
      <Text fontSize="label">{`${recentData.county}, ${recentData.state}`}</Text>
      <Text fontSize="detail">{`reporting on ${recentData.date}`}</Text>
      <Spacer height="0.5em" />
      {recentData.cases > 0 ? (
        <>
          <Text>{`First case: ${get(data, [1, 'date'])}`}</Text>
          <Text>{`cases: ${recentData.cases}`}</Text>
          <Text>{`deaths: ${recentData.deaths}`}</Text>
          <Text>{`death rate:
          ${(deathRate.current * 100).toFixed()}% /
          ${(deathRate.twoWeek * 100).toFixed()}% /
          ${(deathRate.fourWeek * 100).toFixed()}% /
          ${(deathRate.eightWeek * 100).toFixed()}%`}</Text>
          <AreaChart data={data} />
        </>
      ) : (
        <Text>No cases reported</Text>
      )}
    </Flexbox>
  ) : null;
};

Details.propTypes = {
  date: PropTypes.object,
  data: PropTypes.array,
};
