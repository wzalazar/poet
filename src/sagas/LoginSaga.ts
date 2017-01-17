import { browserHistory } from "react-router";
import { Saga, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import Actions from '../actions';

function* loginAction(action: any) {
  yield put({ type: Actions.loginModalOpen });
}

function* handleLoginResponse(action: any) {
  yield put({ type: Actions.loginModalClose });
  yield put({ type: Actions.loginSuccess });
  browserHistory.push('/works'); // redirect to login_success
  localStorage.setItem('user', 'mocked_user');

}

function* loginModalDispose(action: any) {
  yield put({ type: Actions.loginModalClose });
}

function loginSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.loginButtonClicked, loginAction);
    yield takeEvery(Actions.loginModalDisposeRequested, loginModalDispose);
    yield takeEvery(Actions.loginResponse, handleLoginResponse);

  }
}

export default loginSaga;