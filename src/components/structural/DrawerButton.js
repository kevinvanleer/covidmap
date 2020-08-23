import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { SquareButton } from 'kvl-react-ui';

export const DrawerButton = ({ collapsed, ...props }) => (
  <SquareButton {...props}>
    <FontAwesomeIcon
      color="#eee"
      icon={collapsed ? faPlusSquare : faMinusSquare}
      fixedWidth
    />
  </SquareButton>
);

DrawerButton.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
