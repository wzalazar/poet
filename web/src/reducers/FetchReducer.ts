import { FetchStatus } from '../enums/FetchStatus'
import { FetchStore, FetchStoreEntry } from '../store/PoetAppState'

export class FetchType {
  static readonly MARK_LOADING = 'mark loading';
  static readonly SET_RESULT = 'set result';
  static readonly ERROR = 'error for';
  static readonly CLEAR = 'clear for';
  static readonly NOT_FOUND = 'not found';

  static readonly Types: ReadonlyArray<string> = [FetchType.CLEAR, FetchType.MARK_LOADING, FetchType.SET_RESULT, FetchType.ERROR, FetchType.NOT_FOUND];
}

export function fetchReducer(store: FetchStore, action: any): FetchStore {
  if (!actionIsFetchAction(action))
    return store || {};

  const newFetchStoreEntry = actionToFetchStoreEntry(action);

  if (!newFetchStoreEntry)
    return store || {};

  if (action.fetchType === FetchType.CLEAR) {
    return clearCache(store, action.url, newFetchStoreEntry);
  } else {
    return { ...store, [action.url]: newFetchStoreEntry }
  }

}

function actionIsFetchAction(action: any): action is FetchAction {
  // action.type.startsWith('fetch') && ...
  return action.fetchType && FetchType.Types.includes(action.fetchType);
}

interface FetchAction {
  readonly type: string;
  readonly fetchType: string;
  readonly url: string;
  readonly payload: any;
}

function actionToFetchStoreEntry(action: FetchAction): FetchStoreEntry {
  switch (action.fetchType) {
    case FetchType.CLEAR:
      return { status: FetchStatus.Uninitialized, body: null };
    case FetchType.MARK_LOADING:
      return { status: FetchStatus.Loading };
    case FetchType.SET_RESULT:
      return { status: FetchStatus.Loaded, body: action.payload };
    case FetchType.NOT_FOUND:
      return { status: FetchStatus.NotFound, error: action.payload };
    case FetchType.ERROR:
      return { status: FetchStatus.Error, error: action.payload };
    default:
      return null;
  }
}

/**
 * Clears cache for all entries that without the query params match the baseUrl
 */
function clearCache(store: FetchStore, baseUrl: string, newValue: FetchStoreEntry) {
  const matchingUrls = getMatchingUrls(store, baseUrl);
  const newFetchStoreEntries: FetchStore = {};

  for (let matchingUrl of matchingUrls) {
    newFetchStoreEntries[matchingUrl] = newValue;
  }

  return { ...store, ...newFetchStoreEntries }
}

function getMatchingUrls(store: FetchStore, baseUrl: string) {
  return Object.keys(store).filter(url => url.split('?')[0] === baseUrl);
}
