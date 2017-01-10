import Actions from '../actions';

export default function fetchReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.fetchResponseSuccess:
      console.log('fetchReducer', state, action.type, action);
      return { ...state, claim: action.body }
  }
  return state || {};
}