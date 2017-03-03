import { Actions } from '../actions/index';

export default function profileReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.Profile.ProfileFetched:
      return { ...state, ...action.profile };
    case Actions.Profile.NotificationsUpdate:
      return { ...state, notifications: action.payload };
  }
  return state || {};
}