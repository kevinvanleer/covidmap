import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Text, Flexbox, Spacer, Popup } from 'kvl-react-ui';

const labelFontSize = '0.6em';

const StatsItem = ({
  label,
  value,
  popupDescription,
  showPopup,
  onShowPopup,
  bottom,
  right,
  middle,
}) => (
  <Flexbox
    flexDirection="column"
    onClick={() => onShowPopup(!showPopup)}
    style={{ cursor: 'help' }}
  >
    {showPopup ? (
      <Popup
        left={middle ? '6ch' : right ? undefined : '0'}
        right={right ? '0' : undefined}
        bottom={bottom ? '2em' : '4em'}
        handleClick={() => onShowPopup(false)}
      >
        <Flexbox backgroundColor="#222" padding="0.5em">
          <Text maxWidth="30ch" fontSize="detail">
            {popupDescription}
          </Text>
        </Flexbox>
      </Popup>
    ) : null}
    <Text fontSize="detail" bold>{`${
      new Intl.NumberFormat('en-US').format(value) !== 'NaN'
        ? new Intl.NumberFormat('en-US').format(value)
        : value
    }`}</Text>
    <Text fontSize={labelFontSize}>{label.toUpperCase()}</Text>
  </Flexbox>
);

StatsItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
  popupDescription: PropTypes.string,
  showPopup: PropTypes.bool,
  onShowPopup: PropTypes.func,
  bottom: PropTypes.bool,
  right: PropTypes.bool,
  middle: PropTypes.bool,
};

export const Stats = ({
  collapsed,
  recentData,
  newCases,
  ongoingCases,
  population,
}) => {
  const [showPopup, setShowPopup] = useState({
    population: false,
    ongoing: false,
    cases: false,
    deaths: false,
    newCases: false,
    deathRate: false,
  });

  const onShowPopup = (key, value) => {
    let newState = { ...showPopup };
    if (value === false) {
      newState[key] = false;
    } else {
      Object.keys(newState).forEach((key) => {
        newState[key] = false;
      });
      newState[key] = true;
    }
    setShowPopup(newState);
  };

  return !collapsed ? (
    <>
      <Flexbox position="relative">
        <Flexbox flexDirection="column">
          <StatsItem
            value={get(population, 'POPESTIMATE2019', 0)}
            label="population"
            popupDescription="2019 population estimate provided by the United States Census Bureau"
            showPopup={showPopup.population}
            onShowPopup={(newState) => onShowPopup('population', newState)}
          />
          <Spacer height="0.5em" />
          <StatsItem
            value={ongoingCases}
            label="ongoing cases"
            popupDescription="Cases reported within 14 days of the displayed date"
            showPopup={showPopup.ongoing}
            onShowPopup={() => onShowPopup('ongoing', !showPopup.ongoing)}
            bottom
          />
        </Flexbox>
        <Spacer width="0.1em" flexGrow="1" />
        <Flexbox flexDirection="column">
          <StatsItem
            value={get(recentData, 'deaths', 0)}
            label="total deaths"
            popupDescription="Total deaths as reported by The New York Times on the displayed date"
            showPopup={showPopup.deaths}
            onShowPopup={() => onShowPopup('deaths', !showPopup.deaths)}
            middle
          />
          <Spacer height="0.5em" />
          <StatsItem
            value={get(recentData, 'cases', 0)}
            label="total cases"
            popupDescription="Total cases as reported by The New York Times on the displayed date"
            showPopup={showPopup.cases}
            onShowPopup={() => onShowPopup('cases', !showPopup.cases)}
            bottom
            middle
          />
        </Flexbox>
        <Spacer width="0.1em" flexGrow="1" />
        <Flexbox flexDirection="column">
          <StatsItem
            value={Math.round(
              (get(recentData, 'deaths', 0) /
                get(population, 'POPESTIMATE2019', 0)) *
                1e5
            )}
            label="Deaths per 100k"
            popupDescription="Number of deaths that have occurred, normalized to a population of 100,000 individuals"
            showPopup={showPopup.deathRate}
            onShowPopup={() => onShowPopup('deathRate', !showPopup.deathRate)}
            right
          />
          <Spacer height="0.5em" />
          <StatsItem
            value={newCases}
            label="New cases"
            popupDescription="Cases reported on the displayed date"
            showPopup={showPopup.newCases}
            onShowPopup={() => onShowPopup('newCases', !showPopup.newCases)}
            bottom
            right
          />
        </Flexbox>
      </Flexbox>
    </>
  ) : null;
};

Stats.propTypes = {
  collapsed: PropTypes.bool,
  population: PropTypes.object,
  recentData: PropTypes.object,
  newCases: PropTypes.number,
  ongoingCases: PropTypes.number,
};
