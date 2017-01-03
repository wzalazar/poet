import { createStore, Action, compose, applyMiddleware, combineReducers } from 'redux'
import createSagaMiddleware from 'redux-saga'

import sagas from './sagas';
import { countReducer } from './pages/HelloWorld/HelloWorldReducer';

export default function createPoetStore() {
  const enhancer: any = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    combineReducers({
      count: countReducer
    }) as (state: any, action: Action) => any,
    { count: 55 },
    enhancer(
      applyMiddleware(sagaMiddleware)
    )
  );

  sagaMiddleware.run(sagas);

  return store;
}