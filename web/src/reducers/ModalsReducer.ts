import Actions from '../actions/index';

export default function modalsReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.loginModalShow:
      return { ...state, login: true };
    case Actions.loginModalHide:
      return { ...state, login: false };
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
    case Actions.purchaseLicenseModalShow:
      return { ...state, purchaseLicense: true };
    case Actions.purchaseLicenseModalAccept:
    case Actions.purchaseLicenseModalCancel:
      return { ...state, purchaseLicense: false };
  }
  return state || {};
}