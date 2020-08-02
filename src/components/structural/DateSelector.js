import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { Text } from 'kvl-ui';

export const DateSelector = ({ date, setDate }) => (
  <>
    <Slider
      reverse={true}
      min={0}
      max={moment().dayOfYear()}
      onChange={setDate}
    />
    <Text>{date}</Text>
  </>
);

DateSelector.propTypes = {
  date: PropTypes.string,
  setDate: PropTypes.func,
};
