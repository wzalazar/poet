import * as React from "react"
import * as ReactDOM from "react-dom"
import { default as createSagaMiddleware } from "redux-saga"
import { createStore, Action, compose, applyMiddleware, StoreCreator, StoreEnhancer } from "redux"
import { Provider } from "react-redux"
import { Hello } from "./components/Hello"
import { State } from "./state"
import { put } from "redux-saga/effects"
import { takeEvery } from "redux-saga"

function* increase() {
  yield put({ type: 'increase' });
}

const fetchSaga = function*() {
  yield takeEvery('increase requested', increase);
};

interface ReduxWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => StoreCreator
}
const rw = window as ReduxWindow;
const enhancer: any = rw.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  (state: State, action: Action) => {
    if (action.type == 'increase') {
      return { count: state.count + 1 }
    }
    return state
  },
  { count: 0 },
  enhancer(
    applyMiddleware(sagaMiddleware)
  )
);
sagaMiddleware.run(fetchSaga)


ReactDOM.render((
  <Provider store={ store }>
    <Hello />
  </Provider>
  ),
  document.getElementById("app")
);
