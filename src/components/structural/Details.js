import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get, findLast, findLastIndex, last } from 'lodash';
import { Flexbox, Spacer, Text, SquareButton } from 'kvl-react-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlagUsa, faGlobe } from '@fortawesome/free-solid-svg-icons';

import { Stats } from './Stats.js';
import AreaChart from '../core/d3AreaChart.js';
import BarChart from '../core/d3BarChart.js';

import { releaseHold, setSelectedFeature } from '../../state/ui/map.js';

const usPopEst2019 = { POPESTIMATE2019: 328239523 };
const globalPopEst2019 = 7.713e9;

const fillCasesPerDay = (endDate, count) => {
  let fillArray = [];
  for (let idx = 0; idx < count; ++idx) {
    let thisDate = moment(endDate).subtract(idx, 'days');
    let dateArray = thisDate.format('YYYY-MM-DD').split('-');
    fillArray.push({
      date:
        dateArray[2] === '01' && idx !== count - 1
          ? moment.monthsShort(parseInt(dateArray[1]) - 1)
          : dateArray[2],
      value: 0,
    });
  }
  return fillArray.reverse();
};

const getCasesPerDay = (
  data,
  startIndex,
  endIndex,
  population,
  endDate,
  count
) => {
  let casesPerDay = [];
  const start = startIndex >= 1 ? startIndex : 1;
  const end = endIndex >= 1 ? endIndex : 1;

  if (startIndex < 1 && count > 0) {
    casesPerDay = fillCasesPerDay(moment(endDate), count - end);
  }
  if (endIndex >= 0) {
    for (let idx = start; idx <= end; ++idx) {
      let dateArray = get(data, [idx, 'date']).split('-');

      casesPerDay.push({
        date:
          dateArray[2] === '01' && idx !== start
            ? moment.monthsShort(parseInt(dateArray[1]) - 1)
            : dateArray[2],
        value:
          Math.max(
            (idx === 0
              ? data[idx].cases
              : data[idx].cases - data[idx - 1].cases) /
              get(population, 'POPESTIMATE2019'),
            0
          ) * 1e5,
      });
    }
  }
  return casesPerDay;
};

const getNationalPerCapitaAverage = (date, totals, population) => {
  if (totals) {
    const last = findLast(
      totals,
      (status) => status.date <= moment(date).format('YYYY-MM-DD')
    );
    const thirty = findLast(
      totals,
      (status) =>
        status.date <= moment(date).subtract(30, 'days').format('YYYY-MM-DD')
    );
    const casesPerDay = get(last, 'cases', 0) - get(thirty, 'cases', 0) / 30;
    return (casesPerDay / population) * 1e3;
  }
  return NaN;
};

export const Details = ({ date, collapsed }) => {
  const dispatch = useDispatch();
  const globalTotals = useSelector((state) => state.core.worldCovidData.totals);
  const usData = useSelector((state) => state.core.usCovidData.stateAndCounty);
  const worldData = useSelector((state) => state.core.worldCovidData.byCountry);
  const selectedGroup = useSelector((state) => state.ui.map.selectedLayerGroup);
  const selectedFeature = useSelector((state) => state.ui.map.selectedFeature);
  const usPopulations = useSelector(
    (state) => state.core.usCovidData.population
  );
  const worldPopulations = useSelector(
    (state) => state.core.worldCovidData.population
  );
  const totals = useSelector((state) => state.core.usCovidData.totals);
  const activeView = useSelector((state) => state.ui.map.activeView);
  let population = usPopEst2019;
  let backIcon = faFlagUsa;

  if (activeView.name.toLowerCase() === 'world') {
    population = {
      POPESTIMATE2019: get(
        worldPopulations,
        [selectedFeature, 'population'],
        globalPopEst2019
      ),
    };
    backIcon = faGlobe;
  } else {
    population = selectedFeature
      ? usPopulations[selectedFeature]
      : usPopEst2019;
  }

  let entity = useMemo(() => {
    let entity = selectedFeature
      ? {
          displayName:
            selectedFeature < 1000
              ? get(last(usData[selectedFeature]), 'state', 'Unknown')
              : `${get(
                  last(usData[selectedFeature]),
                  'county',
                  'Unknown'
                )}, ${get(last(usData[selectedFeature]), 'state', 'Unknown')}`,
          data: usData[selectedFeature],
        }
      : { displayName: 'United States of America', data: totals };
    if (activeView.name.toLowerCase() === 'world') {
      entity = selectedFeature
        ? {
            displayName: `${get(
              last(get(worldData, [selectedFeature])),
              'country',
              get(worldPopulations, [selectedFeature, 'name'], 'Unknown')
            )}`,
            data: get(worldData, [selectedFeature], []),
          }
        : { displayName: 'Global', data: globalTotals };
    }
    return entity;
  }, [
    selectedFeature,
    usData,
    worldData,
    activeView,
    globalTotals,
    totals,
    worldPopulations,
  ]);
  let xLabel = useMemo(() => moment(date).subtract(14, 'days').format('MMM'), [
    date,
  ]);

  const data = entity.data;
  const recentDataIndex = useMemo(
    () =>
      findLastIndex(data, (status) => status.date <= date.format('YYYY-MM-DD')),
    [data, date]
  );
  const recentData = get(data, [recentDataIndex], { deaths: 0, cases: 0 });
  const yesterday = useMemo(
    () =>
      findLast(
        data,
        (status) =>
          status.date <= moment(date).subtract(1, 'days').format('YYYY-MM-DD')
      ),
    [data, date]
  );
  const twoWeekLagIndex = useMemo(
    () =>
      findLastIndex(
        data,
        (status) =>
          status.date <= moment(date).subtract(2, 'weeks').format('YYYY-MM-DD')
      ),
    [data, date]
  );
  const twoWeekLagData = data[twoWeekLagIndex];

  const newCases = get(recentData, 'cases', 0) - get(yesterday, 'cases', 0);

  const ongoingCases =
    get(recentData, 'cases', 0) - get(twoWeekLagData, 'cases', 0);

  const casesPerDay = useMemo(
    () =>
      getCasesPerDay(
        data,
        twoWeekLagIndex,
        recentDataIndex,
        population,
        date,
        15
      ),
    [data, twoWeekLagIndex, recentDataIndex, population, date]
  );

  const closeStats = useCallback(() => {
    dispatch(releaseHold());
    dispatch(setSelectedFeature(null));
  }, [dispatch]);

  return recentData ? (
    <Flexbox flexDirection="column">
      <Flexbox>
        <Flexbox flexDirection="column" flexGrow={1}>
          <Flexbox>
            <Flexbox flexDirection="column" flexGrow={1}>
              <Text bold fontSize="label">
                {entity.displayName}
              </Text>
              <Text fontSize="detail">
                {recentData.date
                  ? `reporting on ${recentData.date}`
                  : 'no reported cases'}
              </Text>
            </Flexbox>
            {selectedFeature != null ? (
              <SquareButton
                id="covid19-button-close-stats"
                onClick={closeStats}
                backgroundColor="#777"
              >
                <FontAwesomeIcon color="#eee" icon={backIcon} fixedWidth />
              </SquareButton>
            ) : null}
          </Flexbox>
          <Spacer height="0.5em" />
          <Stats
            population={population}
            collapsed={collapsed}
            entity={entity}
            recentData={recentData}
            newCases={newCases}
            ongoingCases={ongoingCases}
          />
        </Flexbox>
      </Flexbox>
      {selectedGroup.name.toLowerCase() === 'per capita' ? (
        <BarChart
          data={casesPerDay}
          average={getNationalPerCapitaAverage(
            date,
            totals,
            parseInt(get(usPopEst2019, 'POPESTIMATE2019'))
          )}
          height={collapsed ? 100 : undefined}
          width={325}
          yLabel="cases in 100k"
          xLabel={xLabel}
        />
      ) : (
        <AreaChart
          data={entity.data}
          currentDate={date}
          height={collapsed ? 100 : undefined}
          width={325}
          currentValue={parseInt(get(recentData, 'cases', 0))}
          showIntercept={true}
        />
      )}
    </Flexbox>
  ) : null;
};

Details.propTypes = {
  date: PropTypes.object,
  collapsed: PropTypes.bool,
};
