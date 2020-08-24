import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Text, Flexbox, Spacer } from 'kvl-react-ui';
import { Grid } from '../presentation/Grid';

const labelFontSize = '0.6em';

export const Stats = ({
  collapsed,
  deathRate,
  recentData,
  newCases,
  ongoingCases,
  population,
}) => {
  return !collapsed ? (
    <>
      <Flexbox>
        <Flexbox flexDirection="column">
          <Flexbox flexDirection="column">
            <Text fontSize="detail" bold>{`${new Intl.NumberFormat(
              'en-US'
            ).format(get(population, 'POPESTIMATE2019', 0))}`}</Text>
            <Text fontSize={labelFontSize}>{`Population`.toUpperCase()}</Text>
          </Flexbox>
          <Spacer height="0.5em" />
          <Flexbox flexDirection="column">
            <Text fontSize="detail" bold>{`${new Intl.NumberFormat(
              'en-US'
            ).format(ongoingCases)}`}</Text>
            <Text fontSize={labelFontSize}>
              {`Ongoing cases`.toUpperCase()}
            </Text>
          </Flexbox>
        </Flexbox>
        <Spacer width="0.1em" flexGrow="1" />
        <Flexbox flexDirection="column">
          <Flexbox flexDirection="column">
            <Text fontSize="detail" bold>{`${new Intl.NumberFormat(
              'en-US'
            ).format(get(recentData, 'deaths', 0))}`}</Text>
            <Text fontSize={labelFontSize}>{`Total deaths`.toUpperCase()}</Text>
          </Flexbox>
          <Spacer height="0.5em" />
          <Flexbox flexDirection="column">
            <Text fontSize="detail" bold>{`${new Intl.NumberFormat(
              'en-US'
            ).format(get(recentData, 'cases', 0))}`}</Text>
            <Text fontSize={labelFontSize}>{`Total cases`.toUpperCase()}</Text>
          </Flexbox>
        </Flexbox>
        <Spacer width="0.1em" flexGrow="1" />
        <Flexbox flexDirection="column">
          <Flexbox flexDirection="column">
            <Text fontSize="detail" bold>{`${(
              deathRate.twoWeek * 100
            ).toFixed()}%`}</Text>
            <Text fontSize={labelFontSize}>{`Death rate`.toUpperCase()}</Text>
          </Flexbox>
          <Spacer height="0.5em" />
          <Flexbox flexDirection="column">
            <Text fontSize="detail" bold>{`${new Intl.NumberFormat(
              'en-US'
            ).format(newCases)}`}</Text>
            <Text fontSize={labelFontSize}>{`New cases`.toUpperCase()}</Text>
          </Flexbox>
        </Flexbox>
      </Flexbox>
    </>
  ) : null;
};

Stats.propTypes = {
  collapsed: PropTypes.bool,
  population: PropTypes.object,
  deathRate: PropTypes.object,
  recentData: PropTypes.object,
  newCases: PropTypes.number,
  ongoingCases: PropTypes.number,
};
