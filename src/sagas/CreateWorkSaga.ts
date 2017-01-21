import { browserHistory } from 'react-router'
import { Saga, takeEvery, delay } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'
import Actions from '../actions'
import config from '../config'

function* createWork(workData: any) {
  yield put({ type: Actions.workModalShow, payload: workData });

  /* Mock */
  yield delay(1000);
  const signatureData =
  // const signatureData = yield take(Actions.createWorkSigned);
  /* End mock */

  yield put(Actions.submittingWork);
  const result = yield call(fetch, config.api.user + '/work', {
    method: 'POST',
    body: JSON.stringify(signatureData)
  });

  yield put({ type: Actions.createWorkSuccess });
  yield take(Actions.workModalDismissRequested);
  yield put({ type: Actions.workModalHide });

  browserHistory.push('/')
}

function createWorkSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.createWorkRequested, createWork);
  }
}

export default createWorkSaga;
