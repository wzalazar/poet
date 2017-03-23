import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

import { Configuration } from '../configuration';
import { Actions } from '../actions/index'
import { FetchType } from '../reducers/FetchReducer';
import { currentPublicKey } from '../selectors/session';
import { select } from 'redux-saga/effects';
import { publicKeyToAddress } from '../bitcoin/addressHelpers';

function* claimsSubmittedSuccess(claimSubmittedAction: any) {
  for (let claim of claimSubmittedAction.claims) {
    if (claim.type === 'Work') {
      yield invalidateWorks();
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
    url: Configuration.api.insight + '/addr/' + address + '/utxo'
  });
  yield put({
    type: 'clear tx history',
    fetchType: FetchType.CLEAR,
    url: `${Configuration.api.insight}/txs`
  });
}

function* invalidateLicenses() {
  const shortUrl = '/licenses';
  const url = Configuration.api.explorer + shortUrl;
  yield put({ type: `clear ${shortUrl}`, fetchType: FetchType.CLEAR, url });
}

function* invalidateWorks() {
  const shortUrl = '/works';
  const url = Configuration.api.explorer + shortUrl;
  yield put({ type: `clear ${shortUrl}`, fetchType: FetchType.CLEAR, url });
}

export function CacheInvalidationSaga() {
  return function*() {
    yield takeEvery(Actions.Claims.SubmittedSuccess, claimsSubmittedSuccess);
    yield takeEvery(Actions.Transactions.SubmittedSuccess, invalidateBalance);
    yield takeEvery(Actions.Licenses.Success, invalidateLicenses);
    yield takeEvery(Actions.Transfer.Success, invalidateWorks);
  }
}