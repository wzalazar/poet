import Actions from '../actions';

export default function modalsReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.signTxIdReceived:
      return { ...state, id: action.payload };
    case Actions.txSubmittedSuccess:
      return { ...state, success: true };
  }
  return state || {};
}
