import { browserHistory } from "react-router";
import { Saga, takeEvery } from 'redux-saga'

import Actions from '../actions';

function* navbarSearchClickAction(): any {
  browserHistory.push('/works');
}

function navbarSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.navbarSearchClick, navbarSearchClickAction);
  }
}

export default navbarSaga;
