import { takeEvery } from 'redux-saga'
import { put, select, take, call } from 'redux-saga/effects'

import Actions from '../actions'
import { currentPublicKey } from '../selectors/session'
import config from '../config'
import {race} from "redux-saga/effects";

async function submitLicense(reference: string, txId: string, outputIndex: number, publicKey: string, referenceOffering: string) {
  return await fetch(config.api.user + '/licenses', {
    method: 'POST',
    body: JSON.stringify({
      txId,
      outputIndex: '' + outputIndex,
      owner: publicKey,
      reference,
      referenceOffering
    })
  }).then((res: any) => res.text())
}

function* payForLicense(action: any) {
  const offering = action.payload.offering;
  const reference = offering.attributes.reference;

  yield put({
    type: Actions.signTxSubmitRequested,
    payload: {
      address: offering.paymentAddress,
      amountInSatoshis: offering.amountInSatoshis,
      conceptOf: action.payload.conceptOf,
      resultAction: Actions.licensePaid,
      resultPayload: offering
    }
  });

  while (true) {
    const result = yield race([
      take(Actions.licensePaid),
      call(function* () {
        yield take(Actions.noBalanceAvailable);
        return false
      })
    ]);
    if (!result) {
      return;
    }
    if (result.payload.id !== offering.id) {
      continue;
    }
    const transaction = result.transaction;
    const outputIndex = result.outputIndex;
    const publicKey = yield select(currentPublicKey);
    yield call(submitLicense, reference, transaction, outputIndex, publicKey, offering.id);
  }
}

export default function() {
  return function*() {
    yield takeEvery(Actions.payForLicenseRequested, payForLicense)
  }
}
