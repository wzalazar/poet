import * as Constants from '../constants';

export default function fetchReducer(state: any, action: any) {
  switch (action.type) {
    case Constants.fetchResponseSuccess:
      console.log('fetchReducer', state, action.type, action);
      return { ...state, claim: action.body }
  }
  return state || {};
}