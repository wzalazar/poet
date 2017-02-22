import { Actions } from '../actions/index';

export default function profileReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.Profile.ProfileFetched:
      return { ...action.profile };
  }
  return state || {};
}