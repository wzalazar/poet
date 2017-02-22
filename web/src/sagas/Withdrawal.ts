import { takeEvery } from 'redux-saga'
import { put, take } from 'redux-saga/effects'

import { Actions } from '../actions/index'

function* withdraw(action: any) {
  const paymentAddress = action.payload.paymentAddress;
  const amountInSatoshis = action.payload.amountInSatoshis;

  yield put({
    type: Actions.Transactions.SignSubmitRequested,
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
