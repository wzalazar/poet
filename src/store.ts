import { createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'

import sagas from './sagas';
import { reducers } from './reducers';
import { initialState } from './state';

export default function createPoetStore() {
  const enhancer: any = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducers,
    initialState,
    enhancer(
      applyMiddleware(sagaMiddleware)
    )
  );

  sagaMiddleware.run(sagas);

  return store;
}