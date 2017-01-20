import { browserHistory } from "react-router";
import { Saga, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import Actions from '../actions';

function* loginModalDisposeRequestedAction(action: any) {
  //const firstStepData = yield take(FIRST_STEP_FILLED)
  //const secondStepData= yield take(SECOND_STEP_FILLED)
  //const thirdStepResult = yield take(CONFIRMED_SUBMISSION)
  //const signatureData= yield take(SIGNED_SUBMISSION)
  //yield put(SENDING_WORK)
  //const result = yield call(firstStepData, secondStepData, signatureData) // post work
  //if (/* result errored */) {/* do something to fix it */ }
  yield put(Actions.navbarSearchClick);
}

function createWorkSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.loginResponse, loginModalDisposeRequestedAction);
  }
}

export default createWorkSaga;
