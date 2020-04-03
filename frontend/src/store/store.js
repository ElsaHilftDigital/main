import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

let instrumenter = f => f;

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    instrumenter = window.__REDUX_DEVTOOLS_EXTENSION__();
} else {
    console.warn('Consider installing Redux DevTools for easier development with Redux https://github.com/zalmoxisus/redux-devtools-extension.');
}

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(preloadedState) {
    const middlewareEnhancer = applyMiddleware(sagaMiddleware);
    const store = createStore(rootReducer, preloadedState, compose(middlewareEnhancer, instrumenter));
    sagaMiddleware.run(rootSaga);

    return store;
}