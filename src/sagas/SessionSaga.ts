import { browserHistory } from "react-router";
import { Saga, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import Actions from '../actions';

const LOCALSTORAGE_SESSION = 'session';
const MOCK_USER = {
  name: 'mock_user'
};
const MOCK_SESSION = {
  user: MOCK_USER
};

function* loginButtonClickedAction(action: any) {
  yield put({ type: Actions.loginModalOpen });
}

function* logoutButtonClickedAction(action: any) {
  yield put({ type: Actions.logoutRequested });
  localStorage.removeItem(LOCALSTORAGE_SESSION);
}

function* loginResponseAction(action: any) {
  yield put({ type: Actions.loginModalClose });
  yield put({ type: Actions.loginSuccess, session: MOCK_SESSION });
  browserHistory.push('/works'); // redirect to login_success
  localStorage.setItem(LOCALSTORAGE_SESSION, JSON.stringify(MOCK_SESSION));
}

function* loginModalDisposeRequestedAction(action: any) {
  yield put({ type: Actions.loginModalClose });
}

function sessionSaga(): Saga {
  return function*() {
    const session = localStorage.getItem(LOCALSTORAGE_SESSION);

    if (session) {
      yield put({ type: Actions.loginSuccess, session: JSON.parse(session) });
    }

    yield takeEvery(Actions.loginButtonClicked, loginButtonClickedAction);
    yield takeEvery(Actions.logoutButtonClicked, logoutButtonClickedAction);
    yield takeEvery(Actions.loginModalDisposeRequested, loginModalDisposeRequestedAction);
    yield takeEvery(Actions.loginResponse, loginResponseAction);

  }
}

export default sessionSaga;