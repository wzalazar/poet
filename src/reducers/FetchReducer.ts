import Actions from '../actions';
import { FetchStatus } from '../enums/FetchStatus';

export default function fetchReducer(state: any, action: any) {
  switch (action.type) {
    case Actions.fetchResponseSuccess:
      return { ...state, [action.url]: { status: FetchStatus.Loaded, body: action.body } }
  }
  return state || {};
}