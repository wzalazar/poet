import Actions from '../actions';

export default function fetchReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.fetchResponseSuccess:
      return { ...state, [action.url]: action.body }
  }
  return state || {};
}