import * as moment from 'moment';

import { Actions } from '../actions/index';
import { Claim, WORK, PROFILE } from '../Claim';

export function claimSignReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.Claims.SubmitRequested:
      return { ...state, details: getClaimDetails(action.payload) };
    case Actions.Claims.IdReceived:
      return { ...state, id: action.payload, submitting: false };
    case Actions.Claims.Response:
      return { ...state, submitting: true };
    case Actions.Claims.SubmittedSuccess:
      return { ...state, success: true };
    case Actions.Modals.SignClaims.Hide:
      return { ...state, success: null, id: null };
  }
  return state || {};
}

function getClaimDetails(claims: ReadonlyArray<Claim>) {
  const workClaim = claims.find(claim => claim.type === WORK);

  if (workClaim)
    return getWorkClaimDetails(workClaim);

  const profileClaim = claims.find(claim => claim.type === PROFILE);

  if (profileClaim)
    return getProfileUpdateDetails(profileClaim);
}

function getWorkClaimDetails(claim: Claim): ReadonlyArray<string> {
  const attributes = claim.attributes as any;
  const name = attributes.find((attribute: any) => attribute.key === 'name');
  const date = attributes.find((attribute: any) => attribute.key === 'submitDate');

  return [
    'Name: ' + (name && name.value || '(Nameless Work)'),
    'Timestamp: ' + (date && moment(date.value).format('DD-MM-YY [at] HH:mm:ss'))
  ] as ReadonlyArray<string>
}

function getProfileUpdateDetails(claim: Claim): ReadonlyArray<string> {
  return [
    'Profile Update'
  ] as ReadonlyArray<string>
}