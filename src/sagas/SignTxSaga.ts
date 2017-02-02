import { Saga, takeEvery } from 'redux-saga'
import { call, put, select, take } from 'redux-saga/effects'
import { browserHistory } from 'react-router'
import Actions from '../actions'
import auth from '../auth'
import config from '../config'

const bitcore = require('bitcore-lib');

import { getUtxos, submitTx } from '../bitcoin/insight';
import { getSighash, applyHexSignaturesInOrder } from '../bitcoin/txHelpers';
import { currentPublicKey } from '../selectors/session'

async function requestIdFromAuth(dataToSign: Buffer[], bitcoin: boolean) {
  return await auth.getRequestIdForMultipleSigningBuffers(dataToSign, bitcoin)
}

async function bindAuthResponse(request: any) {
  return await auth.onResponse(request.id) as any;
}

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

function* signTx(action: any) {
  yield put({ type: Actions.signTxModalShow });

  const publicKey = bitcore.PublicKey(yield select(state => state.session.token.publicKey));
  const offering = action.payload;
  const reference = offering.attributes.reference;

  const myAddress = bitcore.Address(publicKey, bitcore.Networks.testnet);
  const myAddressString = myAddress.toString();
  const utxos = yield call(getUtxos, myAddress);

  const targetAddress = offering.attributes.paymentAddress || myAddressString;
  const amount = 100000 // parseInt(offering.attributes.pricingPriceAmount, 10) || 1000000;

  const tx = new bitcore.Transaction().from(utxos)
    .to(targetAddress, amount)
    .change(myAddressString);
  const sighash = getSighash(tx, myAddress);

  const requestId = yield call(requestIdFromAuth, sighash, true);
  yield put({ type: Actions.signTxIdReceived, payload: requestId.id });
  const response = yield call(bindAuthResponse, requestId);

  applyHexSignaturesInOrder(tx, response.signatures, publicKey);
  const txId = yield call(submitTx, tx.toString());
  const license = yield call(submitLicense, reference, txId, 0, publicKey.toString(), offering.id);

  yield put({ type: Actions.txSubmittedSuccess });
  yield take(Actions.signTxModalDismissRequested);
  yield put({ type: Actions.signTxModalHide });

  browserHistory.push(`/claims/${license}`)
}

function* mockLoginHit(action: any) {
  yield call(fetch, config.api.mockApp + '/' + action.payload, { method: 'POST' })
}

function claimSubmitSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.signTxSubmitRequested, signTx);
    yield takeEvery(Actions.fakeTxSign, mockLoginHit);
  }
}

export default claimSubmitSaga;
