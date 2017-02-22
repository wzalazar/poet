import { browserHistory } from "react-router";
import { Saga, takeEvery } from 'redux-saga'

import { Actions } from '../actions/index';

function* navbarSearchClickAction(): any {
  browserHistory.push('/works');
}

export function navbarSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.Navbar.SearchClick, navbarSearchClickAction);
  }
}
