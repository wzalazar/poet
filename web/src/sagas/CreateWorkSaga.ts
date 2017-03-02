import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

import { Actions } from '../actions/index'
import { WORK } from '../Claim';

function* claimSubmittedSuccess(action: any) {
  const workClaim = action.claims.find((claim: any) => claim.type === WORK);

  if (!workClaim)
    return;

  yield put({ type: Actions.Modals.CreateWorkResult.Show });

}

export function createWorkSaga() {
  return function*() {
    yield takeEvery(Actions.Claims.SubmittedSuccess, claimSubmittedSuccess)
  }
}