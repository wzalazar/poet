import Actions from '../actions';

export default function profileReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.profileDataFetched:
      return { ...action.profile };
  }
  return state || {};
}