import { takeEvery } from 'redux-saga'
import { call, put, select, take, race } from 'redux-saga/effects'
import * as protobuf from 'protobufjs'

import { Configuration } from '../configuration';
import { Actions } from '../actions/index'
import { TransferRequestedAction } from '../actions/requests';
import { Authentication } from '../authentication'
import { currentPublicKey } from '../selectors/session'
import { getMockPrivateKey } from '../helpers/mockKey'

const jsonClaims = require('../claim.json');

interface TransferAttributes {
  readonly currentOwner: string
  readonly reference: string
  readonly owner: string
}

export function transferSaga() {
  return function*() {
    yield takeEvery(Actions.Transfer.TransferRequested, modalFlow);
    yield takeEvery(Actions.Transfer.FakeTransferSign, mockLoginHit);
  }
}

function* modalFlow(action: TransferRequestedAction) {
  yield race({
    transferFlow: call(transferFlow, action),
    dismiss: call(watchDismiss)
  })
}

function* mockLoginHit(action: any) {
  yield call(fetch, Configuration.api.mockApp + '/' + getMockPrivateKey() + '/' + action.payload, { method: 'POST' })
}

function* transferFlow(action: TransferRequestedAction) {
  yield put({ type: Actions.Modals.Transfer.Show, workId: action.workId });

  const publicKey = yield select(currentPublicKey);

  const setTransferAction = yield take(Actions.Transfer.SetTransferTarget);
  const selectedOwner = setTransferAction.payload;

  const payload: TransferAttributes = {
    currentOwner: publicKey,
    reference: action.workId,
    owner: selectedOwner
  };

  const serializedToSign = [ builder.getEncodedForSigning(payload, publicKey) ];

  const requestId = yield call(requestIdFromAuth, serializedToSign, publicKey);
  yield put({ type: Actions.Transfer.TransferIdReceived, payload: requestId.id });
  const response = yield call(bindAuthResponse, requestId);

  const result = yield call(submitClaims, response);

  yield put({ type: Actions.Transfer.Success});
  yield take(Actions.Modals.Transfer.DismissRequested);
  yield put({ type: Actions.Modals.Transfer.Hide });
}

function* watchDismiss() {
  yield take(Actions.Modals.Transfer.DismissRequested);
  yield put({ type: Actions.Modals.Transfer.Hide });
}

async function requestIdFromAuth(dataToSign: string[], publicKey: string) {
  return await Authentication.getRequestIdForMultipleSigning(dataToSign, false, publicKey);
}

async function bindAuthResponse(request: any) {
  return await Authentication.onResponse(request.id) as any;
}

const builder = new class {
  private attribute: any;
  private claim: any;

  constructor() {
    const root = protobuf.Root.fromJSON(jsonClaims);
    this.attribute = root.lookup('Poet.Attribute');
    this.claim = root.lookup('Poet.Claim');
  }

  public getEncodedForSigning(data: TransferAttributes, publicKey: string): string {
    return new Buffer(this.claim.encode(this.claim.create({
      id: new Buffer(''),
      publicKey: new Buffer(publicKey, 'hex'),
      signature: new Buffer(''),
      type: 'Title',
      attributes: this.getAttributes(data)
    })).finish()).toString('hex')
  }

  private getAttributes(attrs: any) {
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

};

async function submitClaims(data: any) {
  return await fetch(Configuration.api.user + '/claims', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then((res: any) => res.text())
}
