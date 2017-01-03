import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createStore, Action, compose, applyMiddleware, StoreCreator, StoreEnhancer, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { default as createSagaMiddleware, takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

import './extensions/Window'
import { Hello } from './pages/HelloWorld/Hello'
import { State } from './state'

function* increase() {
  yield put({ type: 'increase' });
}

const fetchSaga = function*() {
  yield takeEvery('increase requested', increase);
};

const enhancer: any = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const countIncreaseReducer = (count: number, action: Action) => {
  if (action.type == 'increase') {
    return count + 1;
  }
  return count
};

const store = createStore(
  combineReducers({
    count: countIncreaseReducer
  }),
  { count: 0 },
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
