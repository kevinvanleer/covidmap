import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { SquareButton } from 'kvl-ui';

export const DrawerButton = ({ collapsed, ...props }) => (
  <SquareButton {...props}>
    {collapsed ? (
      <>
        <FontAwesomeIcon color="#eee" icon={faPlusSquare} />
      </>
    ) : (
      <>
        <FontAwesomeIcon color="#eee" icon={faMinusSquare} />
      </>
    )}
  </SquareButton>
);

DrawerButton.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
