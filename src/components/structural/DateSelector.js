import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import Slider from 'rc-slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import 'rc-slider/assets/index.css';

import { Text, Flexbox, SquareButton, Spacer } from 'kvl-react-ui';
import { togglePlayPause } from '../../state/core/time.js';

export const DateSelector = ({ setDate, withChart }) => {
  const dispatch = useDispatch();
  const timeState = useSelector((state) => state.core.time);
  return (
    <Flexbox margin={withChart ? '0 0 0 30px' : '0'} flexDirection="column">
      <Slider
        min={timeState.min}
        max={timeState.max}
        onChange={(value) => {
          setDate(value);
        }}
        value={timeState.current}
      />
      <Flexbox>
        <SquareButton
          id="button-legend-play-pause"
          onClick={() => dispatch(togglePlayPause())}
          backgroundColor="#777"
        >
          <FontAwesomeIcon
            color="#eee"
            icon={timeState.rate === 0 ? faPlay : faPause}
          />
        </SquareButton>
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
