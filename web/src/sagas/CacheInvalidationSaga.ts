import { Saga, takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

import { Configuration } from '../config';
import Actions from '../actions'
import { FetchType } from '../reducers/FetchReducer';

function* claimsSubmittedSuccess(claimSubmittedAction: any) {
  for (let claim of claimSubmittedAction.claims) {
    if (claim.type === 'Work') {
      const shortUrl = '/works';
      const url = Configuration.api.explorer + shortUrl;
      yield put({ type: `clear ${shortUrl}`, fetchType: FetchType.CLEAR, url });
    }
  }
}

export function CacheInvalidationSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.claimsSubmitedSuccess, claimsSubmittedSuccess);
  }
}