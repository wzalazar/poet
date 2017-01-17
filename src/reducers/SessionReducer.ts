import Actions from '../actions';

export default function sessionReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.loginSuccess:
      return {
        user: action.user
      };
    case Actions.logoutRequested:
      return null;
  }
  return state || {};
}