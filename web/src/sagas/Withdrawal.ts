import { put } from 'redux-saga/effects'
import Actions from '../actions'
import { take } from 'redux-saga/effects'
import { select } from 'redux-saga/effects'
import { currentPublicKey } from '../selectors/session'
import { call } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'
/**
 * Created by jd on 2/3/17.
 */

function* withdraw(action: any) {
  const paymentAddress = action.payload.paymentAddress;
  const amountInSatoshis = action.payload.amountInSatoshis;

  yield put({
    type: Actions.signTxSubmitRequested,
    payload: {
      paymentAddress,
      amountInSatoshis,
      conceptOf: action.payload.conceptOf,
      resultAction: Actions.withdrawalDone,
      resultPayload: {}
    }
  });

  yield take(Actions.withdrawalDone);
}

export default function() {
  return function*() {
    yield takeEvery(Actions.withdrawalRequested, withdraw)
  }
}
