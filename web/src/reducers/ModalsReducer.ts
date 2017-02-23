import { Action } from 'redux';

import { Actions } from '../actions/index';
import { ModalStore } from '../store/PoetAppState';

export function modalsReducer(state: ModalStore, action: Action): ModalStore {
  switch (action.type) {
    case Actions.Modals.Login.Show:
      return { ...state, login: true };
    case Actions.Modals.Login.Hide:
      return { ...state, login: false };

    case Actions.Modals.SignClaims.Show:
      return { ...state, signWork: true };
    case Actions.Modals.SignClaims.Hide:
      return { ...state, signWork: false };

    case Actions.Modals.SignTransaction.Show:
      return { ...state, signTx: true };
    case Actions.Modals.SignTransaction.Hide:
      return { ...state, signTx: false };

    case Actions.Modals.Transfer.Show:
      return { ...state, transfer: true };
    case Actions.Modals.Transfer.Hide:
      return { ...state, transfer: false };

    case Actions.Modals.PurchaseLicense.Show:
      return { ...state, purchaseLicense: true };
    case Actions.Modals.PurchaseLicense.Accept:
    case Actions.Modals.PurchaseLicense.Cancel:
      return { ...state, purchaseLicense: false };

    case Actions.Modals.CreateWorkResult.Show:
      return { ...state, createWorkResult: true };
    case Actions.Modals.CreateWorkResult.Hide:
      return { ...state, createWorkResult: false };
  }
  return state || {};
}