import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducers from './reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import rootSagas from './saga';

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

if (__DEV__) {
    middleware.unshift(createLogger({ collapsed: true }));
}
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    // whitelist: [],
    // blacklist: ['user'],
};
const persistedReducer = persistReducer(persistConfig, rootReducers);

const reduxDevtoolsCompose =
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : null;

const composeEnhancers = reduxDevtoolsCompose
    ? reduxDevtoolsCompose({
          shouldHotReload: true,
      })
    : compose => compose;
const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(...middleware)));
const persistor = persistStore(store);
sagaMiddleware.run(rootSagas);

export { store, persistor };
