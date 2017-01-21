import Actions from '../actions';

export default function modalsReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.loginModalClose:
      return { ...state, login: false };
    case Actions.loginModalOpen:
      return { ...state, login: true };
    case Actions.workModalShow:
      return { ...state, signWork: true };
    case Actions.workModalHide:
      return { ...state, signWork: false };
  }
  return state || {};
}