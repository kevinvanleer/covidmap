import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import monitorReducersEnhancer from './enhancers/monitorReducer.js';
import loggerMiddleware from './middleware/logger.js';
import rootReducer from './rootReducer.js';

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [loggerMiddleware, ...getDefaultMiddleware()],
    preloadedState,
    enhancers: [monitorReducersEnhancer],
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./core', () => store.replaceReducer(rootReducer));
  }

  return store;
}
