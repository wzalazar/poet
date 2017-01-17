import { browserHistory } from "react-router";
import { Saga, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import Actions from '../actions';

const MOCK_USER = {
  name: 'mock_user'
};

function* loginAction(action: any) {
  yield put({ type: Actions.loginModalOpen });
}

function* logoutAction(action: any) {
  yield put({ type: Actions.logoutRequested });
  localStorage.removeItem('user');
}

function* handleLoginResponse(action: any) {
  yield put({ type: Actions.loginModalClose });
  yield put({ type: Actions.loginSuccess, user: MOCK_USER });
  browserHistory.push('/works'); // redirect to login_success
  localStorage.setItem('user', 'mocked_user');

}

function* loginModalDispose(action: any) {
  yield put({ type: Actions.loginModalClose });
}

function loginSaga(): Saga {
  return function*() {
    const user = localStorage.getItem('user');

    if (user) {
      console.log('user already logged in', user);
      yield put({ type: Actions.loginSuccess, user: MOCK_USER });
    }

    yield takeEvery(Actions.loginButtonClicked, loginAction);
    yield takeEvery(Actions.logoutButtonClicked, logoutAction);
    yield takeEvery(Actions.loginModalDisposeRequested, loginModalDispose);
    yield takeEvery(Actions.loginResponse, handleLoginResponse);

  }
}

export default loginSaga;