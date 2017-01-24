import { Saga, takeEvery } from 'redux-saga'
import { call, put, take, select } from 'redux-saga/effects'
import * as protobuf from 'protobufjs'
import Actions from '../actions'
import auth from '../auth'
import config from '../config'

declare var require: (moduleId: string) => any;
const jsonClaims = require('../claim.json');

async function requestIdFromAuth(dataToSign: string[]) {
  return await auth.getRequestIdForMultipleSigning(dataToSign)
}

async function bindAuthResponse(request: any) {
  const data = await auth.onResponse(request.id) as any;
  return {
    publicKey: data.signature.publicKey,
    token: { ...data.signature, message: data.message }
  }
}

class ClaimBuilder {
  attribute: any
  claim: any

  constructor() {
    const builder = protobuf.loadJson(JSON.stringify(jsonClaims));
    this.attribute = builder.lookup('Poet.Attribute');
    this.claim = builder.lookup('Poet.Claim');
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
    return this.claim.encode(this.claim.create({
      id: new Buffer(''),
      publicKey: new Buffer(publicKey, 'hex'),
      signature: new Buffer(''),
      type: data.type,
      attributes: this.getAttributes(data.attributes)
    })).finish().toString('hex')
  }
}

const builder = new ClaimBuilder();

function* signClaims(claimTemplates: any) {
  yield put({ type: Actions.signClaimsModalShow });

  const publicKey = yield select(state => state.session.token.publicKey);

  const serializedToSign = claimTemplates.payload.map((template: any) => {
    return builder.getEncodedForSigning(template, publicKey);
  });

  const requestId = yield call(requestIdFromAuth, serializedToSign);
  yield put({ type: Actions.claimIdReceived, payload: requestId });
  const response = yield call(bindAuthResponse, requestId);
  yield put({ type: Actions.claimsResponse, payload: response });

  const result = yield call(fetch, config.api.user + '/claims', {
    method: 'POST',
    body: JSON.stringify({
      claims: response.payload,
    })
  });

  yield put({ type: Actions.claimsSubmitedSuccess });
  yield take(Actions.claimsModalDismissRequested);
  yield put({ type: Actions.signClaimsModalHide });
}

function claimSubmitSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.claimsSubmitRequested, signClaims);
  }
}

export default claimSubmitSaga;
