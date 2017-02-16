import { Saga, takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

import { Config } from '../config';
import Actions from '../actions/index'
import { FetchType } from '../reducers/FetchReducer';
import { currentPublicKey } from '../selectors/session';
import { select } from 'redux-saga/effects';

function* claimsSubmittedSuccess(claimSubmittedAction: any) {
  for (let claim of claimSubmittedAction.claims) {
    if (claim.type === 'Work') {
      const shortUrl = '/works';
      const url = Config.api.explorer + shortUrl;
      yield put({ type: `clear ${shortUrl}`, fetchType: FetchType.CLEAR, url });
    }
    if (claim.type === 'Profile') {
      const publicKey = yield select(currentPublicKey)
      yield put({ type: Actions.fetchProfileData, profilePublicKey: publicKey });
    }
  }
}

export function CacheInvalidationSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.claimsSubmitedSuccess, claimsSubmittedSuccess);
  }
}