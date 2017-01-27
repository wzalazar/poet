import { Saga, takeEvery } from 'redux-saga'
import { call, put, select, take } from 'redux-saga/effects'
import { browserHistory } from 'react-router'
import * as protobuf from 'protobufjs'

import Actions from '../actions'
import auth from '../auth'
import config from '../config'

const bitcore = require('bitcore-lib');

declare var require: (moduleId: string) => any;
const jsonClaims = require('../claim.json');

async function requestIdFromAuth(dataToSign: Buffer[], bitcoin: boolean) {
  return await auth.getRequestIdForMultipleSigningBuffers(dataToSign, bitcoin)
}

async function insightSubmit(tx: string) {
  return await fetch(
    'https://test-insight.bitpay.com/api/tx/send',
    { method: 'POST', body: tx }
  ).then((res: any) => res.text())
}

async function bindAuthResponse(request: any) {
  return await auth.onResponse(request.id) as any;
}

async function submitLicense(reference: string, txId: string, outputNumber: number, publicKey: string, referenceOffering: string) {
  return await fetch(config.api.user + '/license', {
    method: 'POST',
    body: JSON.stringify({
      txId,
      outputNumber: '' + outputNumber,
      owner: publicKey,
      reference,
      referenceOffering
    })
  }).then((res: any) => res.text())
}

async function getUtxos(address: string) {
  return await fetch(`https://test-insight.bitpay.com/api/addr/${address}/utxo`)
    .then((res: any) => res.json())
}

function getSighash(tx: any, address: string): Buffer[] {
  return tx.inputs.map(
    (input: any, index: number) =>
      bitcore.Transaction.Sighash.sighashPreimage(
        tx,
        bitcore.crypto.Signature.SIGHASH_ALL,
        index,
        bitcore.Script.buildPublicKeyHashOut(address)
      )
  )
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

  tx.sign('b698d86c67a2cff80405bd47af322216c552fd3a52f9c58a70f7b3a3313895b1')
   /*
   TODO Unmock
   tx.inputs.map(
    (input: any, index: number) => {
      tx.applySignature({
        inputIndex: index,
        sigtype: bitcore.crypto.Signature.SIGHASH_ALL,
        publicKey: publicKey,
        signature: bitcore.crypto.Signature.fromDER(new Buffer(response.signatures[index].signature, 'hex'))
      })
    }
  )
  */
  const submit = yield call(insightSubmit, tx.toString())

  const result = yield call(submitLicense, reference, submit, 0, publicKey.toString(), offering.id);

  yield put({ type: Actions.txSubmittedSuccess });
  yield take(Actions.signTxModalDismissRequested);
  yield put({ type: Actions.signTxModalHide });

  browserHistory.push(`/blocks/${result}`)
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
