import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import createSagaMiddleware, { Saga } from "redux-saga";
import { fork } from "redux-saga/effects";

import pageCreators from "./pages";
import sagaList from './sagas'
import { PageLoader } from './components/PageLoader';
import fetchReducer from './reducers/FetchReducer'

function bindSagas(pages: PageLoader<any, any>[]): Saga {
  const sagas: Saga[] = pages.map(page => page.sagaHook).concat(...sagaList).map(saga => saga());

  return function*() {
    for (let saga of sagas) {
      if (saga) {
        yield fork(saga);
      }
    }
  }

}

function bindReducers(pages: PageLoader<any, any>[]): any {
  const reducerList: any = {};

  for (let page of pages) {
    const reducerDescription = (page as any).reducerHook();
    if (reducerDescription) {
      reducerList[reducerDescription.subState] = reducerDescription.reducer;
    }
  }

  reducerList.fetch = fetchReducer;

  return reducerList;
}

function bindInitialState(pages: PageLoader<any, any>[]): any {
  const initialState: any = {};

  for (let page of pages) {
    const reducerDescription = (page as any).reducerHook();
    if (reducerDescription) {
      initialState[reducerDescription.subState] = page.initialState();
    }
  }

  return initialState;
}

export default function createPoetStore() {
  const pages = pageCreators.map(Page => new Page());

  const initialState = bindInitialState(pages);
  const reducerList = bindReducers(pages);

  const enhancer: any = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    combineReducers(reducerList),
    initialState,
    enhancer(applyMiddleware(sagaMiddleware))
  );

  sagaMiddleware.run(bindSagas(pages));

  return { store, pages };
}