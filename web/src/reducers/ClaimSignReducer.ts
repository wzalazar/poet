import Actions from '../actions/index';

export default function modalsReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.claimIdReceived:
      return { ...state, id: action.payload, submitting: false };
    case Actions.claimsResponse:
      return { ...state, submitting: true };
    case Actions.claimsSubmitedSuccess:
      return { ...state, success: true };
    case Actions.signClaimsModalHide:
      return { ...state, success: null, id: null };
  }
  return state || {};
}
