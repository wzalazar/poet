import Actions from '../actions/index';

export default function modalsReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.loginModalClose:
      return { ...state, login: false };
    case Actions.loginModalOpen:
      return { ...state, login: true };
    case Actions.signClaimsModalShow:
      return { ...state, signWork: true };
    case Actions.signClaimsModalHide:
      return { ...state, signWork: false };
    case Actions.signTxModalShow:
      return { ...state, signTx: true };
    case Actions.signTxModalHide:
      return { ...state, signTx: false };
    case Actions.transferModalShow:
      return { ...state, transfer: true };
    case Actions.transferModalHide:
      return { ...state, transfer: false };
  }
  return state || {};
}