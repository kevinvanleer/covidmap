import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get, findLast, set, isEmpty } from 'lodash';
import { Flexbox, Spacer, Text } from 'kvl-ui';

export const Stats = ({
  collapsed,
  entity,
  deathRate,
  recentData,
  newCases,
  ongoingCases,
}) => {
  return !collapsed ? (
    <>
      <Text>{`Total cases: ${new Intl.NumberFormat('en-US').format(
        get(recentData, 'cases', 0)
      )}`}</Text>
      <Text>{`Total deaths: ${new Intl.NumberFormat('en-US').format(
        get(recentData, 'deaths', 0)
      )}`}</Text>
      <Text>{`New cases: ${new Intl.NumberFormat('en-US').format(
        newCases
      )}`}</Text>
      <Text>{`Ongoing cases: ${new Intl.NumberFormat('en-US').format(
        ongoingCases
      )}`}</Text>
      <Text>{`death rate:
          ${(deathRate.current * 100).toFixed()}% /
          ${(deathRate.twoWeek * 100).toFixed()}% /
          ${(deathRate.fourWeek * 100).toFixed()}% /
          ${(deathRate.eightWeek * 100).toFixed()}%`}</Text>
    </>
  ) : null;
};

Stats.propTypes = {
  collapsed: PropTypes.bool,
  entity: PropTypes.object,
  deathRate: PropTypes.object,
  recentData: PropTypes.object,
  newCases: PropTypes.number,
  ongoingCases: PropTypes.number,
};
