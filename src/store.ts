import { createStore, compose, applyMiddleware, combineReducers } from "redux"
import createSagaMiddleware from "redux-saga"
import { default as pageCreators } from "./pages"
import { fork } from "redux-saga/effects"

export default function createPoetStore() {

  const pages = pageCreators.map(Page => new Page());

  const initialState: any = {};
  const reducerList: any = {};

  for (let page of pages) {
    const reducerDescription = page.reducerHook();
    reducerList[reducerDescription.subState] = reducerDescription.reducer;
    initialState[reducerDescription.subState] = page.initialState()
  }

  const sagas = pages.map(page => page.sagaHook());
  const saga = function*() {
    for (let saga of sagas) {
      yield fork(saga);
    }
  };

  const enhancer: any = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    combineReducers(reducerList),
    initialState,
    enhancer(
      applyMiddleware(sagaMiddleware)
    )
  );

  sagaMiddleware.run(saga);

  return { store, pages };
}