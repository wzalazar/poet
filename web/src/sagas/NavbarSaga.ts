import { browserHistory } from "react-router";
import { takeEvery } from 'redux-saga'

import { Actions } from '../actions/index';

function* navbarSearchClickAction(): any {
  browserHistory.push('/works');
}

export function navbarSaga() {
  return function*() {
    yield takeEvery(Actions.Navbar.SearchClick, navbarSearchClickAction);
  }
}
