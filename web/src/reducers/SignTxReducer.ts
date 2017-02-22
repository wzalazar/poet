import { Actions } from '../actions/index';

export function signTransactionReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.Transactions.SignIdReceived:
      return { ...state, id: action.payload, submitting: false };
    case Actions.Modals.SignTransaction.Hide:
      return { ...state, id: null, success: null };
    case Actions.Transactions.Submitting:
      return { ...state, id: null, submitting: true };
    case Actions.Transactions.SubmittedSuccess:
      return { ...state, id: null, success: true };
    case Actions.noBalanceAvailable:
      return { ...state, id: null, success: null, noBalance: true };
  }
  return state || {};
}
