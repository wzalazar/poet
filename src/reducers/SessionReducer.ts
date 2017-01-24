import Actions from '../actions';
import Constants from '../constants';

export default function sessionReducer(state: any, action: any) {
  if (action.type) {
    switch (action.type) {
      case Actions.loginSuccess:
        return {
          state: Constants.LOGGED_IN,
          token: action.payload
        };
      case Actions.logoutRequested:
        return {
          state: Constants.NO_SESSION
        };
      case Actions.loginIdReceived:
        return {
          state: Constants.WAITING_SIGNATURE,
          requestId: action.payload.id
        };
    }
  }
  return state || { state: Constants.NO_SESSION };
}