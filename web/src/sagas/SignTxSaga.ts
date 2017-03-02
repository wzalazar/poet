import * as bitcore from 'bitcore-lib';

import { takeEvery } from 'redux-saga';
import { call, put, select, take, race } from 'redux-saga/effects';

import { Actions } from '../actions/index';
import auth from '../auth';
import { getMockPrivateKey } from '../mockKey';
import config from '../config';
import { getUtxos, submitTx } from '../bitcoin/insight';
import { getSighash, applyHexSignaturesInOrder } from '../bitcoin/txHelpers';
import { currentPublicKey } from '../selectors/session';

async function requestIdFromAuth(dataToSign: Buffer[], bitcoin: boolean) {
  return await auth.getRequestIdForMultipleSigningBuffers(dataToSign, bitcoin)
}

async function bindAuthResponse(request: any) {
  return await auth.onResponse(request.id) as any;
}

export interface SignTransactionParameters {
  paymentAddress: string
  amountInSatoshis: number
  conceptOf: string
  resultAction: string
  resultPayload: any
}

export function* signTx(action: { payload: SignTransactionParameters }) {
  yield put({ type: Actions.Modals.SignTransaction.Show, payload: action.payload });

  const publicKey = bitcore.PublicKey(yield select(currentPublicKey))

  const myAddress = bitcore.Address(publicKey, bitcore.Networks.testnet);
  const myAddressString = myAddress.toString();
  const utxos = yield call(getUtxos, myAddress);

  const targetAddress = action.payload.paymentAddress;
  const amount = parseInt('' + action.payload.amountInSatoshis, 10);
  if (!utxos.reduce((prev: number, next: any) => prev + next.satoshis, 0)) {
    yield put({ type: Actions.noBalanceAvailable });
    return
  }
  const tx = new bitcore.Transaction().from(utxos)
    .to(targetAddress, amount)
    .change(myAddressString);
  const sighash = getSighash(tx, myAddress);

  const requestId = yield call(requestIdFromAuth, sighash, true);
  yield put({ type: Actions.Transactions.SignIdReceived, payload: requestId.id });
  const response = yield call(bindAuthResponse, requestId);
  yield put({ type: Actions.Transactions.Submitting });

  applyHexSignaturesInOrder(tx, response.signatures, publicKey);
  const txId = yield call(submitTx, tx.toString());

  yield put({
    type: action.payload.resultAction,
    payload: action.payload.resultPayload,
    transaction: txId,
    outputIndex: 0 // TODO: Sort inputs according to BIP69 and change this.
  });

  yield put({ type: Actions.Transactions.SubmittedSuccess });
}

export function* signTxCancellable(action: { payload: SignTransactionParameters }) {
  yield race({
    signTx: call(signTx, action),
    hideModal: call(function*() {
      yield take(Actions.Modals.SignTransaction.Hide);
    })
  })
}

export function* mockLoginHit(action: any) {
  yield call(fetch, config.api.mockApp + '/' + getMockPrivateKey() + '/' + action.payload, { method: 'POST' })
}

export function claimSubmitSaga() {
  return function*() {
    yield takeEvery(Actions.Transactions.SignSubmitRequested, signTxCancellable as any);
    yield takeEvery(Actions.Transactions.FakeSign, mockLoginHit);
  }
}

export default claimSubmitSaga;
