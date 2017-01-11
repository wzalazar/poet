import Actions from '../actions';

export default function fetchReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.fetchResponseSuccess:
      const newState = { ...state };
      newState[action.url] = action.body;
      return newState;
  }
  return state || {};
}