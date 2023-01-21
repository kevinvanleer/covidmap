import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import Slider from 'rc-slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faFilter } from '@fortawesome/free-solid-svg-icons';
import { ToggleButton } from '../presentation/ToggleButton';
import { Menu } from '../presentation/Menu';
import 'rc-slider/assets/index.css';

import { Text, Flexbox, SquareButton, Spacer, Popup } from 'kvl-react-ui';
import {
  togglePlayPause,
  setDuration,
  setCurrent,
} from '../../state/core/time.js';

export const DateSelector = ({ withChart }) => {
  const dispatch = useDispatch();
  const timeState = useSelector((state) => state.core.time);
  const [showTimeFilterMenu, setShowTimeFilterMenu] = useState(false);

  const onSetCurrentTime = useCallback(
    (value) => dispatch(setCurrent(value)),
    [dispatch]
  );

  const onSetDuration = useCallback(
    (duration) => dispatch(setDuration(duration)),
    [dispatch]
  );

  const onTogglePlayPause = useCallback(
    () => dispatch(togglePlayPause()),
    [dispatch]
  );

  return (
    <Flexbox margin={withChart ? '0 0 0 30px' : '0'} flexDirection="column">
      <Slider
        min={timeState.min}
        max={timeState.max}
        onChange={onSetCurrentTime}
        value={timeState.current}
      />
      <Flexbox>
        <SquareButton
          id="button-legend-play-pause"
          onClick={onTogglePlayPause}
          backgroundColor="#777"
        >
          <FontAwesomeIcon
            color="#eee"
            icon={timeState.rate === 0 ? faPlay : faPause}
          />
        </SquareButton>
        <Spacer width="1em" />
        <Flexbox position="relative">
          <ToggleButton
            id="button-legend-time-filter"
            onClick={() => setShowTimeFilterMenu(!showTimeFilterMenu)}
            active={!showTimeFilterMenu}
            icon={faFilter}
          />
          {showTimeFilterMenu ? (
            <Popup
              backgroundColor="#222"
              bottom="36px"
              left="36px"
              flexDirection="column"
              padding="0.5em 0"
              handleClick={() => {}}
            >
              <Menu>
                <Text
                  onClick={() => {
                    onSetDuration(moment.duration(7, 'days'));
                    setShowTimeFilterMenu(false);
                  }}
                  bold={timeState.duration?.asDays() === 7}
                  padding="0.5em 1em"
                  nowrap
                >
                  7 days
                </Text>
                <Text
                  onClick={() => {
                    onSetDuration(moment.duration(14, 'days'));
                    setShowTimeFilterMenu(false);
                  }}
                  bold={timeState.duration?.asDays() === 14}
                  padding="0.5em 1em"
                  nowrap
                >
                  14 days
                </Text>
                <Text
                  onClick={() => {
                    onSetDuration(moment.duration(30, 'days'));
                    setShowTimeFilterMenu(false);
                  }}
                  bold={timeState.duration?.asDays() === 30}
                  padding="0.5em 1em"
                  nowrap
                >
                  30 days
                </Text>
                <Text
                  onClick={() => {
                    onSetDuration(null);
                    setShowTimeFilterMenu(false);
                  }}
                  bold={timeState.duration === null}
                  padding="0.5em 1em"
                  nowrap
                >
                  off
                </Text>
              </Menu>
            </Popup>
          ) : null}
        </Flexbox>
        <Spacer flexGrow={1} />
        <Text>{moment(timeState.current, 'x').format('YYYY-MM-DD')}</Text>
      </Flexbox>
    </Flexbox>
  );
};

DateSelector.propTypes = {
  setDate: PropTypes.func,
  withChart: PropTypes.bool,
};
