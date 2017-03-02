import { takeEvery } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'

import { Actions } from '../actions/index';
import { FetchStatus } from '../enums/FetchStatus'
import { getResourceState } from '../selectors/fetch'
import { FetchType, FetchAction } from '../reducers/FetchReducer';

const NOT_FOUND = 'not found';


export function fetchSaga() {
  return function*() {
    yield takeEvery(Actions.fetchRequest, fetchData);
  }
}

function* fetchData(action: any) {
  const url = action.payload.url;
  const short = getLatestTwoNamesOnResource(url);

  const currentState = yield select(getResourceState(url));
  if (currentState === FetchStatus.Loading) {
    return
  }
  yield dispatchFetchStatusUpdate(FetchType.MARK_LOADING, 'mark loading ' + short, url);

  const { result, error, headers } = yield call(apiFetch, url);
  if (error) {
    if (error === NOT_FOUND) {
      yield dispatchFetchStatusUpdate(FetchType.NOT_FOUND, 'not found ' + short, url, error, headers);
    } else {
      yield dispatchFetchStatusUpdate(FetchType.ERROR, 'error for ' + short, url, error, headers);
    }
  } else {
    yield dispatchFetchStatusUpdate(FetchType.SET_RESULT, 'set result ' + short, url, result, headers);
  }

}

function getLatestTwoNamesOnResource(str: string) {
  const parts = str.split('?')[0].split('/');
  return parts.slice(parts.length - 2).join('/');
}

function apiFetch(url: string): Promise<{result: Object, headers: Headers}> {
  return fetch(url)
    .then((r: any) => {
      if (r.status === 404) {
        return { error: NOT_FOUND };
      }
      if (r.status !== 200) {
        return r.body().then((error: any) => ({ error }));
      }
      return r.json().then((json: any) => ({ result: json, headers: r.headers }));
    })
    .catch((error: any) => ({ error }));
}

function dispatchFetchStatusUpdate(fetchType: FetchType, type: string, url: string, body?: any, headers?: Headers) {
  const fetchAction: FetchAction = { fetchType, type, url, body, headers };
  return put(fetchAction);
}