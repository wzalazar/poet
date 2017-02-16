import Actions from '../actions/index';

export default function modalsReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.transferIdReceived:
      return { ...state, id: action.payload };
    case Actions.transferSuccess:
      return { ...state, success: true };
    case Actions.setTransferTarget:
      return { ...state, success: null, targetPublicKey: action.payload };
  }
  return state || {};
}
