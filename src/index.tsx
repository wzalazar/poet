import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore, Action, compose, applyMiddleware, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { default as createSagaMiddleware, takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

import './extensions/Window'
import { Hello } from './pages/HelloWorld/HelloWorld'
import { countReducer } from './pages/HelloWorld/HelloWorldReducer';

function* increase() {
  yield put({ type: 'increase' });
}

function* decrease() {
  yield put({ type: 'decrease' });
}

const fetchSaga = function*() {
  yield takeEvery('increase requested', increase);
  yield takeEvery('decrease requested', decrease);
};

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
sagaMiddleware.run(fetchSaga);

ReactDOM.render((
    <Provider store={ store }>
      <Hello />
    </Provider>
  ),
  document.getElementById("app")
);

