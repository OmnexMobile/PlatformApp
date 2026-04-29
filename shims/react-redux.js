import React, { createContext, forwardRef, useContext, useMemo, useRef, useSyncExternalStore } from 'react';

const ReactReduxContext = createContext(null);

const shallowEqual = (left, right) => {
    if (Object.is(left, right)) {
        return true;
    }

    if (typeof left !== 'object' || left === null || typeof right !== 'object' || right === null) {
        return false;
    }

    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);

    if (leftKeys.length !== rightKeys.length) {
        return false;
    }

    for (const key of leftKeys) {
        if (!Object.prototype.hasOwnProperty.call(right, key) || !Object.is(left[key], right[key])) {
            return false;
        }
    }

    return true;
};

const Provider = ({ children, store }) => {
    const value = useMemo(() => ({ store }), [store]);
    return <ReactReduxContext.Provider value={value}>{children}</ReactReduxContext.Provider>;
};

const useReduxContext = () => {
    const context = useContext(ReactReduxContext);

    if (!context?.store) {
        throw new Error('Redux store is not available in context');
    }

    return context;
};

const useStore = () => useReduxContext().store;

const useDispatch = () => useStore().dispatch;

const useSelector = (selector, equalityFn = Object.is) => {
    const store = useStore();
    const selected = useSyncExternalStore(
        store.subscribe,
        () => selector(store.getState()),
        () => selector(store.getState()),
    );
    const selectedRef = useRef(selected);

    if (!equalityFn(selectedRef.current, selected)) {
        selectedRef.current = selected;
    }

    return selectedRef.current;
};

const createStoreHook = () => useStore;
const createDispatchHook = () => useDispatch;
const createSelectorHook = () => useSelector;

const bindActionCreators = (actionCreators, dispatch) => {
    const bound = {};

    Object.keys(actionCreators || {}).forEach(key => {
        if (typeof actionCreators[key] === 'function') {
            bound[key] = (...args) => dispatch(actionCreators[key](...args));
        }
    });

    return bound;
};

const connect = (mapStateToProps, mapDispatchToProps, mergeProps) => WrappedComponent => {
    const ConnectedComponent = forwardRef((props, ref) => {
        const store = useStore();

        const stateProps = useSyncExternalStore(
            store.subscribe,
            () => (mapStateToProps ? mapStateToProps(store.getState(), props) || {} : {}),
            () => (mapStateToProps ? mapStateToProps(store.getState(), props) || {} : {}),
        );

        const dispatchProps = useMemo(() => {
            if (typeof mapDispatchToProps === 'function') {
                return mapDispatchToProps(store.dispatch, props) || {};
            }

            if (mapDispatchToProps && typeof mapDispatchToProps === 'object') {
                return bindActionCreators(mapDispatchToProps, store.dispatch);
            }

            return { dispatch: store.dispatch };
        }, [store, props]);

        const finalProps = mergeProps
            ? mergeProps(stateProps, dispatchProps, props)
            : { ...props, ...stateProps, ...dispatchProps };

        return <WrappedComponent ref={ref} {...finalProps} />;
    });

    ConnectedComponent.displayName = `Connect(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return ConnectedComponent;
};

const batch = callback => callback();

export {
    Provider,
    ReactReduxContext,
    batch,
    connect,
    createDispatchHook,
    createSelectorHook,
    createStoreHook,
    shallowEqual,
    useDispatch,
    useSelector,
    useStore,
};
