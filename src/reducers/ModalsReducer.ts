import Actions from '../actions';

export default function modalsReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.loginModalClose:
      return { ...state, login: false };
    case Actions.loginModalOpen:
      return { ...state, login: true };
  }
  return state || {};
}