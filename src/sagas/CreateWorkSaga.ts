import { browserHistory } from 'react-router'
import { Saga, takeEvery, delay } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'
import Actions from '../actions'
import config from '../config'

function* createWork(workData: any) {
  yield put({ type: Actions.workModalShow, payload: workData });

  /* Mock */
  yield delay(1000);
  const signatureData = workData
  // const signatureData = yield take(Actions.createWorkSigned);
  /* End mock */

  yield put(Actions.submittingWork);
  const result = yield call(fetch, config.api.user + '/claimHelper', {
    method: 'POST',
    body: JSON.stringify({
      claims: signatureData.payload,
      privateKey: '2111d5dc1bf2c48b73d271375a11f853f92aca53d328f35af5cbaead016ebeb5'
    })
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
