import React from 'react';
import { Provider } from 'react-redux';
import { configure, addDecorator } from '@storybook/react';

import configureAppStore from '../src/state/configureAppStore';

const store = configureAppStore();

export const decorators = [
  (story) => <Provider store={store}>{story()}</Provider>,
];
