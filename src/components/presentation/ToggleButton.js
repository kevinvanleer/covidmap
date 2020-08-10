import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SquareButton } from 'kvl-ui';

export const ToggleButton = ({ id, onClick, icon, active }) => (
  <SquareButton
    id={id}
    onClick={onClick}
    backgroundColor={active ? '#777' : '#333'}
  >
    <FontAwesomeIcon icon={icon} color={active ? '#eee' : '#777'} fixedWidth />
  </SquareButton>
);

ToggleButton.propTypes = {
  id: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.object,
  active: PropTypes.bool,
};
