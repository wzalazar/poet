import { browserHistory } from 'react-router'
import { takeEvery } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import * as protobuf from 'protobufjs'

import { Configuration } from '../configuration';
import { Actions } from '../actions/index'
import { Authentication } from '../authentication'
import { currentPublicKey } from '../selectors/session'
import { getMockPrivateKey } from '../helpers/mockKey'
import { Claim } from '../Claim';

const jsonClaims = require('../claim.json');

export interface SubmitRequestedAction {
  readonly publicKey: string;
  readonly payload: ReadonlyArray<Claim>;
  readonly noModal: boolean;
}

export function submitClaims() {
  return function*() {
    yield takeEvery(Actions.Claims.SubmitRequested, submitRequested);
    yield takeEvery(Actions.Claims.FakeSign, fakeSign);
  }
}

function* submitRequested(action: SubmitRequestedAction) {
  if (!action.noModal)
    yield put({ type: Actions.Modals.SignClaims.Show });

  const publicKey = (yield select(currentPublicKey)) || action.publicKey;

  if (!publicKey)
    throw new Error('Claim Sign Saga: cannot sign a claim without a public key.');

  const serializedToSign = action.payload.map(builder.getEncodedForSigning.bind(null, publicKey)) as string[];

  const requestId = yield call(requestIdFromAuth, serializedToSign, publicKey);
  yield put({ type: Actions.Claims.IdReceived, payload: requestId.id });

  const response = yield call(getAuthResponse, requestId);
  yield put({ type: Actions.Claims.Response, payload: response });

  const postClaimsResult = yield call(postClaims, response);

  yield put({ type: Actions.Claims.SubmittedSuccess, claims: action.payload });

  if (!action.noModal)
    yield put({ type: Actions.Modals.SignClaims.Hide });

  const createdWorkClaim = postClaimsResult.createdClaims.find((claim: Claim) => claim.type === 'Work');
  const updatedProfile = postClaimsResult.createdClaims.find((claim: Claim) => claim.type === 'Profile');

  if (createdWorkClaim) {
    const submittedWorkClaim = action.payload.find(_ => _.type === 'Work') as any
    const supersedes = submittedWorkClaim && submittedWorkClaim.attributes.find((_: any) => _.key === 'supersedes')
    browserHistory.push(`/works/` + (supersedes ? supersedes.value : createdWorkClaim.id));
  } else if (updatedProfile) {
    browserHistory.push(`/profiles/` + publicKey);
  } else {
    browserHistory.push(`/portfolio/`);
  }

}

function* fakeSign(action: any) {
  yield call(fetch, Configuration.api.mockApp + '/' + getMockPrivateKey() + '/' + action.payload, { method: 'POST' })
}

const builder = new class {
  private readonly attribute: any;
  private readonly claim: any;

  constructor() {
    const root = protobuf.Root.fromJSON(jsonClaims);
    this.attribute = root.lookup('Poet.Attribute');
    this.claim = root.lookup('Poet.Claim');
  }

  private getAttributes(attributes: ReadonlyArray<KeyValue<string, string>> | {[index: string]: string}) {
    const attributesArray = attributes instanceof Array ? attributes : Object.entries(attributes).map(([key, value]) => ({key, value}));
    return attributesArray.map(this.attribute.create, this.attribute)
  }

  getEncodedForSigning = (publicKey: string, data: Claim): string => {
    return new Buffer(this.claim.encode(this.claim.create({
      id: new Buffer(''),
      publicKey: new Buffer(publicKey, 'hex'),
      signature: new Buffer(''),
      type: data.type,
      attributes: this.getAttributes(data.attributes)
    })).finish()).toString('hex')
  }
};

async function requestIdFromAuth(dataToSign: string[], notifyPubkey: string) {
  return await Authentication.getRequestIdForMultipleSigning(dataToSign, false, notifyPubkey)
}

async function getAuthResponse(request: any) {
  return await Authentication.onResponse(request.id) as any;
}

async function postClaims(data: any) {
  return await fetch(Configuration.api.user + '/claims', {
    method: 'POST',
    body: JSON.stringify(data)
  }).then(res => res.json())
}
