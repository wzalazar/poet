import Actions from '../actions';

export default function sessionReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.loginSuccess:
      return action.session;
    case Actions.logoutRequested:
      return null;
  }
  return state || {};
}