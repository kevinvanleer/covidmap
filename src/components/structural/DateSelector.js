import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import Slider from 'rc-slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import 'rc-slider/assets/index.css';

import { Text, Flexbox, Button, Spacer } from 'kvl-ui';
import { togglePlayPause } from '../../state/core/time.js';

export const DateSelector = ({ date, setDate }) => {
  const dispatch = useDispatch();
  const timeState = useSelector((state) => state.core.time);
  return (
    <>
      <Slider
        min={timeState.min}
        max={timeState.max}
        onChange={(value) => {
          setDate(value);
        }}
        value={timeState.current}
      />
      <Flexbox>
        <Button
          id="button-legend-play-pause"
          onClick={() => dispatch(togglePlayPause())}
        >
          <FontAwesomeIcon
            color="#eee"
            icon={timeState.rate === 0 ? faPlay : faPause}
          />
        </Button>
        <Spacer flexGrow={1} />
        <Text>{moment(timeState.current, 'x').format('YYYY-MM-DD')}</Text>
      </Flexbox>
    </>
  );
};

DateSelector.propTypes = {
  date: PropTypes.object,
  setDate: PropTypes.func,
};
