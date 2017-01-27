import { Saga, takeEvery } from 'redux-saga'
import { call, put, select, take } from 'redux-saga/effects'
import { browserHistory } from 'react-router'
import * as protobuf from 'protobufjs'

import Actions from '../actions'
import auth from '../auth'
import config from '../config'

declare var require: (moduleId: string) => any;
const jsonClaims = require('../claim.json');

async function requestIdFromAuth(dataToSign: string[]) {
  return await auth.getRequestIdForMultipleSigning(dataToSign, false)
}

async function bindAuthResponse(request: any) {
  return await auth.onResponse(request.id) as any;
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

  getEncodedForSigning(data: any, publicKey: string): string {
    return new Buffer(this.claim.encode(this.claim.create({
      id: new Buffer(''),
      publicKey: new Buffer(publicKey, 'hex'),
      signature: new Buffer(''),
      type: data.type,
      attributes: this.getAttributes(data.attributes)
    })).finish()).toString('hex')
  }
}

async function submitClaims(data: any) {
  return await fetch(config.api.user + '/claims', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then((res: any) => res.text())
}

const builder = new ClaimBuilder();

function* signClaims(claimTemplates: any) {
  yield put({ type: Actions.signClaimsModalShow });

  const publicKey = yield select(state => state.session.token.publicKey);

  const serializedToSign = claimTemplates.payload.map((template: any) => {
    return builder.getEncodedForSigning(template, publicKey);
  });

  const requestId = yield call(requestIdFromAuth, serializedToSign);
  yield put({ type: Actions.claimIdReceived, payload: requestId.id });
  const response = yield call(bindAuthResponse, requestId);
  yield put({ type: Actions.claimsResponse, payload: response });

  const result = yield call(submitClaims, response)

  yield put({ type: Actions.claimsSubmitedSuccess });
  yield take(Actions.claimsModalDismissRequested);
  yield put({ type: Actions.signClaimsModalHide });

  browserHistory.push(`/`);
}

function* mockLoginHit(action: any) {
  yield call(fetch, config.api.mockApp + '/' + action.payload, { method: 'POST' })
}

function claimSubmitSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.claimsSubmitRequested, signClaims);
    yield takeEvery(Actions.fakeClaimSign, mockLoginHit);
  }
}

export default claimSubmitSaga;
