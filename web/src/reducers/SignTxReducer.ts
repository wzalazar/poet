import Actions from '../actions';

export default function modalsReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.signTxIdReceived:
      return { ...state, id: action.payload };
    case Actions.signTxModalHide:
      return { ...state, id: null, success: null };
    case Actions.txSubmittedSuccess:
      return { ...state, id: null, success: true };
  }
  return state || {};
}
