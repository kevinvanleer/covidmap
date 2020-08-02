import React from 'react';
import PropTypes from 'prop-types';
import { Flexbox, Spacer, Text } from 'kvl-ui';

import AreaChart from '../core/d3AreaChart.js';

export const Details = ({ info, data }) => (
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
    <Text fontSize="label">{`${info.county}, ${info.state}`}</Text>
    <Text fontSize="detail">{`reporting on ${info.date}`}</Text>
    <Spacer height="0.5em" />
    {info.cases > 0 ? (
      <>
        <Text>{`cases: ${info.cases}`}</Text>
        <Text>{`deaths: ${info.deaths}`}</Text>
        <Text>{`death rate: ${(
          info.deathRate.fourWeek * 100
        ).toFixed()}%`}</Text>
        <AreaChart data={data} />
      </>
    ) : (
      <Text>No cases reported</Text>
    )}
  </Flexbox>
);

Details.propTypes = {
  info: PropTypes.object,
  data: PropTypes.array,
};
