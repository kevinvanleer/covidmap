import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import monitorReducersEnhancer from './enhancers/monitorReducer.js';
import loggerMiddleware from './middleware/logger.js';
import rootReducer from './rootReducer.js';

export default function configureAppStore(preloadedState) {
  const storeConfig = {
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()],
    preloadedState,
    enhancers: [],
  };

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./core', () => store.replaceReducer(rootReducer));
    storeConfig.middleware.push(loggerMiddleware);
    storeConfig.enhancers.push(monitorReducersEnhancer);
  }

  const store = configureStore(storeConfig);

  return store;
}
