const Console = console;

const logger = (store) => (next) => (action) => {
  Console.group(action.type);
  Console.info('dispatching', action);
  let result = next(action);
  Console.log('next state', store.getState());
  Console.groupEnd();
  return result;
};

export default logger;
