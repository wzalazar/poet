import { browserHistory } from 'react-router'
import { Saga, takeEvery, delay } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'
import Actions from '../actions'
import config from '../config'

function* createWork(workData: any) {
  yield put({ type: Actions.signClaimsModalShow, payload: workData });

  /* Mock */
  yield delay(1000);
  const signatureData = workData
  // const signatureData = yield take(Actions.claimsSigned);
  /* End mock */

  yield put(Actions.claimsSubmitting);
  const result = yield call(fetch, config.api.user + '/claimHelper', {
    method: 'POST',
    body: JSON.stringify({
      claims: signatureData.payload,
      privateKey: '2111d5dc1bf2c48b73d271375a11f853f92aca53d328f35af5cbaead016ebeb5'
    })
  });

  yield put({ type: Actions.claimsSubmitedSuccess });
  yield take(Actions.claimsModalDismissRequested);
  yield put({ type: Actions.signClaimsModalHide });

  browserHistory.push('/')
}

function createWorkSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.claimsSubmitRequested, createWork);
  }
}

export default createWorkSaga;
