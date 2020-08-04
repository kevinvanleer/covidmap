import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { Text } from 'kvl-ui';

export const DateSelector = ({ date, setDate }) => (
  <>
    <Slider
      min={0}
      max={moment().subtract(1, 'days').dayOfYear()}
      onChange={(value) => {
        setDate(moment().dayOfYear(value));
      }}
      value={moment(date).dayOfYear()}
    />
    <Text>{date}</Text>
  </>
);

DateSelector.propTypes = {
  date: PropTypes.string,
  setDate: PropTypes.func,
};
