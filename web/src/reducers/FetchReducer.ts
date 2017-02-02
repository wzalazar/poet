import { FetchStatus } from '../enums/FetchStatus'
import { FetchStore } from '../store/PoetAppState'

const MARK_LOADING = 'mark loading';
const SET_RESULT = 'set result';
const ERRORED = 'error for';
const CLEAR = 'clear for';
const NOT_FOUND = 'not found';

export function updateKey(object: { [key: string]: any }, key: string, updateValue: any) {
  return Object.assign({}, object, { [key]: updateValue });
}

const types = [CLEAR, MARK_LOADING, SET_RESULT, ERRORED, NOT_FOUND];

function secondSpacePosition(str: string) {
  return str.indexOf(' ', str.indexOf(' ') + 1)
}

function retrieveKey(str: string) {
  return str.slice(secondSpacePosition(str) + 1)
}

function getActionType(str: string) {
  for (let type of types) {
    if (str.indexOf(type) === 0) {
      return type
    }
  }
}

export default function fetchReducer(store: FetchStore, action: any) {
  let newValue;
  switch(action.fetchType) {
    case CLEAR:
      newValue = { status: FetchStatus.Uninitialized, body: null };
      break;
    case MARK_LOADING:
      newValue = { status: FetchStatus.Loading };
      break;
    case SET_RESULT:
      newValue = { status: FetchStatus.Loaded, body: action.payload };
      break;
    case NOT_FOUND:
      newValue = { status: FetchStatus.NotFound, error: action.payload };
      break;
    case ERRORED:
      newValue = { status: FetchStatus.Error, error: action.payload };
      break;
    default:
      return store || {}
  }
  return updateKey(store, action.url, newValue);
}
