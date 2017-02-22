import { Saga, takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

import { Config } from '../config';
import { Actions } from '../actions/index'
import { FetchType } from '../reducers/FetchReducer';
import { currentPublicKey } from '../selectors/session';
import { select } from 'redux-saga/effects';
import { publicKeyToAddress } from '../bitcoin/addressHelpers';

function* claimsSubmittedSuccess(claimSubmittedAction: any) {
  for (let claim of claimSubmittedAction.claims) {
    if (claim.type === 'Work') {
      const shortUrl = '/works';
      const url = Config.api.explorer + shortUrl;
      yield put({ type: `clear ${shortUrl}`, fetchType: FetchType.CLEAR, url });
    }
    if (claim.type === 'Profile') {
      const publicKey = yield select(currentPublicKey);
      yield put({ type: Actions.Profile.FetchProfile, profilePublicKey: publicKey });
    }
  }
}

function* invalidateBalance() {
  const address = publicKeyToAddress(yield select(currentPublicKey));
  yield put({
    type: 'clear balance',
    fetchType: FetchType.CLEAR,
    url: Config.api.insight + '/addr/' + address + '/utxo'
  });
  yield put({
    type: 'clear tx history',
    fetchType: FetchType.CLEAR,
    url: `${Config.api.insight}/txs`
  });
}

export function CacheInvalidationSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.Claims.SubmittedSuccess, claimsSubmittedSuccess);
    yield takeEvery(Actions.txSubmittedSuccess, invalidateBalance);
  }
}