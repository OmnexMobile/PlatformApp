import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducers from './reducer';
// import AsyncStorage from '@react-native-community/async-storage';
// import { persistStore, persistReducer } from 'redux-persist';
import rootSagas from './saga';

const sagaMiddleware = createSagaMiddleware();
const middleware = [createLogger({ collapsed: false }), sagaMiddleware];
// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: [],
//   blacklist: [
//     'user'
//   ],
// };
// const persistedReducer = persistReducer(persistConfig, rootReducers);

if (__DEV__) {
    const createDebugger = require('redux-flipper').default;
    middleware.push(createDebugger());
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          shouldHotReload: true,
      })
    : compose => compose;
const store = createStore(rootReducers, composeEnhancers(applyMiddleware(...middleware)));
// const persistor = persistStore(store);
sagaMiddleware.run(rootSagas);

export { store };
