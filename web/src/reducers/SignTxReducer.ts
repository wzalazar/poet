import { Actions } from '../actions/index';
import { SignTransactionStore } from '../store/PoetAppState';

export function signTransactionReducer(state: SignTransactionStore, action: any): SignTransactionStore | {} {
  switch (action.type) {
    case Actions.Transactions.SignIdReceived:
      return { ...state, id: action.payload, submitting: false };
    case Actions.Transactions.Submitting:
      return { ...state, id: null, submitting: true };
    case Actions.Transactions.SubmittedSuccess:
      return { ...state, id: null, success: true };
    case Actions.Transactions.NoBalanceAvailable:
      return { ...state, id: null, success: null, noBalance: true };
    case Actions.Modals.SignTransaction.Hide:
      return { ...state, id: null, success: null };
  }
  return state || {};
}
