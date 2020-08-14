import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Text } from 'kvl-ui';

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
      <Text>{`Death rate: ${(deathRate.twoWeek * 100).toFixed()}%`}</Text>
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
