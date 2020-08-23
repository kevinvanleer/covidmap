import React from 'react';
import PropTypes from 'prop-types';
import { Flexbox, Text } from 'kvl-react-ui';

export const AliveStatusWait = ({ status }) => (
  <Flexbox
    backgroundColor="#222"
    position="absolute"
    top="0"
    bottom="0"
    left="0"
    right="0"
  >
    <Text
      position="absolute"
      margin="0 auto"
      top="50%"
      zIndex={100}
      width="100%"
      centerAlign
      fontSize="title"
      color="#eee"
    >
      {status.error
        ? `API server failed to respond`
        : `Waiting for API server to wake up...`}
    </Text>
  </Flexbox>
);

AliveStatusWait.propTypes = {
  status: PropTypes.object,
};
