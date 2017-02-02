import Actions from '../actions';

export default function modalsReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.claimIdReceived:
      return { ...state, id: action.payload };
    case Actions.claimsSubmitedSuccess:
      return { ...state, success: true };
    case Actions.signClaimsModalHide:
      return { ...state, success: null, id: null };
  }
  return state || {};
}
