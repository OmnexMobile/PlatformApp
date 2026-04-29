import { createStore, compose, applyMiddleware } from 'redux';

const createFallbackPersistor = () => ({
    purge: async () => {},
    flush: async () => {},
    pause: () => {},
    persist: () => {},
    dispatch: () => {},
    getState: () => ({}),
    subscribe: () => () => {},
});

const createFallbackStore = enhancer => createStore((state = {}) => state, enhancer);

const resolveComposeEnhancer = () => {
    const reduxDevtoolsCompose =
        typeof window !== 'undefined' && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === 'function'
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            : null;

    return reduxDevtoolsCompose
        ? reduxDevtoolsCompose({
              shouldHotReload: true,
          })
        : compose;
};

let store;
let persistor;

try {
    const { createLogger } = require('redux-logger');
    const createSagaMiddleware = require('redux-saga').default;
    const { persistStore, persistReducer } = require('redux-persist');
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const rootReducers = require('./reducer').default;
    const rootSagas = require('./saga').default;

    const sagaMiddleware = createSagaMiddleware();
    const middleware = [sagaMiddleware];

    if (__DEV__ && typeof createLogger === 'function') {
        middleware.unshift(createLogger({ collapsed: true }));
    }

    const persistConfig = {
        key: 'root',
        storage: AsyncStorage,
    };

    const persistedReducer = persistReducer(persistConfig, rootReducers);
    const enhancer = resolveComposeEnhancer()(applyMiddleware(...middleware));

    store = createStore(persistedReducer, enhancer);
    persistor = persistStore(store);
    sagaMiddleware.run(rootSagas);
} catch (error) {
    console.error('[store] Failed to initialize persisted store', error);
    const enhancer = resolveComposeEnhancer()(applyMiddleware());
    store = createFallbackStore(enhancer);
    persistor = createFallbackPersistor();
}

export { store, persistor };
