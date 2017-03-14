import { browserHistory } from 'react-router'
import { takeEvery } from 'redux-saga'
import { call, put, select, take, race } from 'redux-saga/effects'
import * as protobuf from 'protobufjs'

import { Configuration } from '../config';
import { Actions } from '../actions/index'
import auth from '../auth'
import { currentPublicKey } from '../selectors/session'
import { getMockPrivateKey } from '../mockKey'
import { Claim } from '../Claim';

const jsonClaims = require('../claim.json');

async function requestIdFromAuth(dataToSign: string[]) {
  return await auth.getRequestIdForMultipleSigning(dataToSign, false)
}

async function bindAuthResponse(request: any) {
  return await auth.onResponse(request.id) as any;
}

interface TransferAttributes {
  currentOwner: string
  reference: string
  owner: string
}

class ClaimBuilder {
  attribute: any
  claim: any

  constructor() {
    const root = protobuf.Root.fromJSON(jsonClaims);
    this.attribute = root.lookup('Poet.Attribute');
    this.claim = root.lookup('Poet.Claim');
  }

  getAttributes(attrs: any) {
    if (attrs instanceof Array) {
      return attrs.map(attr => {
        return this.attribute.create(attr)
      })
    } else {
      return Object.keys(attrs).map(attr => {
        return this.attribute.create({
          key: attr,
          value: attrs[attr]
        })
      })
    }
  }

  getEncodedForSigning(data: TransferAttributes, publicKey: string): string {
    return new Buffer(this.claim.encode(this.claim.create({
      id: new Buffer(''),
      publicKey: new Buffer(publicKey, 'hex'),
      signature: new Buffer(''),
      type: 'Title',
      attributes: this.getAttributes(data)
    })).finish()).toString('hex')
  }
}

async function submitClaims(data: any) {
  return await fetch(Configuration.api.user + '/claims', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then((res: any) => res.text())
}

const builder = new ClaimBuilder();

function* watchDismiss() {
  yield take(Actions.Modals.Transfer.DismissRequested)
  yield put({ type: Actions.Modals.Transfer.Hide })
}

function* modalFlow(action: any) {
  yield race({
    transferFlow: call(transferFlow, action),
    dismiss: call(watchDismiss)
  })
}

function* transferFlow(action: any) {
  yield put({ type: Actions.Modals.Transfer.Show });

  const publicKey = yield select(currentPublicKey);

  const setTransferAction = yield take(Actions.Transfer.SetTransferTarget);
  const selectedOwner = setTransferAction.payload;

  const payload: TransferAttributes = {
    currentOwner: publicKey,
    reference: action.workId,
    owner: selectedOwner
  }
  const serializedToSign = [ builder.getEncodedForSigning(payload, publicKey) ];

  const requestId = yield call(requestIdFromAuth, serializedToSign);
  yield put({ type: Actions.Transfer.TransferIdReceived, payload: requestId.id });
  const response = yield call(bindAuthResponse, requestId);

  const result = yield call(submitClaims, response);

  yield put({ type: Actions.Transfer.Success});
  yield take(Actions.Modals.Transfer.DismissRequested);
  yield put({ type: Actions.Modals.Transfer.Hide });

  browserHistory.push(`/`);
}

function* mockLoginHit(action: any) {
  yield call(fetch, Configuration.api.mockApp + '/' + getMockPrivateKey() + '/' + action.payload, { method: 'POST' })
}

function transferSaga() {
  return function*() {
    yield takeEvery(Actions.Transfer.TransferRequested, modalFlow);
    yield takeEvery(Actions.Transfer.FakeTransferSign, mockLoginHit);
  }
}

export default transferSaga;
