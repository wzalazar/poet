import { Action } from 'redux';

import { Actions } from '../actions/index';
import { ModalStore } from '../store/PoetAppState';
import { WorkOffering, Work } from '../Interfaces';

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
      const purchaseLicenseAction = action as { work: Work, offering: WorkOffering } & Action;
      return { ...state, purchaseLicense: {
        visible: true, offering: purchaseLicenseAction.offering, work: purchaseLicenseAction.work
      } };
    case Actions.Licenses.Paid:
      return { ...state, purchaseLicense: {
        ...state.purchaseLicense, resultId: (action as any).payload.id
      } };

    case Actions.Modals.PurchaseLicense.ShowSuccess:
      return { ...state, purchaseLicense: { ...state.purchaseLicense, visible: true, success: true } };
    case Actions.Modals.PurchaseLicense.Hide:
      return { ...state, purchaseLicense: { ...state.purchaseLicense, visible: false } };
    case Actions.Modals.PurchaseLicense.Cancel:
      return { ...state, purchaseLicense: null };

    case Actions.Modals.CreateWorkResult.Show:
      return { ...state, createWorkResult: true };
    case Actions.Modals.CreateWorkResult.Hide:
      return { ...state, createWorkResult: false };

    case Actions.Modals.TryItOut.Show:
      return { ...state, tryItOut: true};
    case Actions.Modals.TryItOut.Hide:
      return { ...state, tryItOut: false};
  }
  return state || {};
}