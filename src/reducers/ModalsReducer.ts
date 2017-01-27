import Actions from '../actions';

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
  }
  return state || {};
}