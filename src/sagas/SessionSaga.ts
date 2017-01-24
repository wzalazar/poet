import { browserHistory } from 'react-router'
import { Saga, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import Actions from '../actions'
import auth from '../auth'
import config from '../config'

const LOCALSTORAGE_SESSION = 'session';

async function requestIdFromAuth() {
  return await auth.getRequestIdForLogin()
}

async function bindAuthResponse(request: any) {
  const data = await auth.onResponse(request.id) as any;
  return {
    publicKey: data.signature.publicKey,
    token: { ...data.signature, message: data.message }
  }
}

function* loginButtonClickedAction(action: any) {
  yield put({ type: Actions.loginModalOpen });
  const requestId = yield call(requestIdFromAuth);
  yield put({ type: Actions.loginIdReceived, payload: requestId });
  const response = yield call(bindAuthResponse, requestId);
  yield put({ type: Actions.loginResponse, payload: response })
}

function* logoutButtonClickedAction(action: any) {
  yield put({ type: Actions.logoutRequested });
  localStorage.removeItem(LOCALSTORAGE_SESSION);
  browserHistory.push('/');
}

function* loginResponseAction(action: any) {
  yield put({ type: Actions.loginModalClose });
  yield put({ type: Actions.loginSuccess, token: action.payload });
  browserHistory.push('/'); // TODO: redirect to login_success
  localStorage.setItem(LOCALSTORAGE_SESSION, JSON.stringify(action.payload));
}

function* mockLoginHit(action: any) {
  yield call(fetch, config.api.mockApp + '/' + action.payload, { method: 'POST' })
}

function* loginModalDisposeRequestedAction(action: any) {
  yield put({ type: Actions.loginModalClose });
}

function sessionSaga(): Saga {
  return function*() {
    const session = localStorage.getItem(LOCALSTORAGE_SESSION);

    if (session) {
      yield put({ type: Actions.loginSuccess, token: JSON.parse(session) });
    }

    yield takeEvery(Actions.loginButtonClicked, loginButtonClickedAction);
    yield takeEvery(Actions.logoutButtonClicked, logoutButtonClickedAction);
    yield takeEvery(Actions.loginModalDisposeRequested, loginModalDisposeRequestedAction);
    yield takeEvery(Actions.loginResponse, loginResponseAction);
    yield takeEvery(Actions.mockLoginRequest, mockLoginHit);

  }
}

export default sessionSaga;