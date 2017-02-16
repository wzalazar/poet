import { Saga, takeEvery } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'

import Actions from '../actions/index';
import { PoetAppState } from '../store/PoetAppState'
import { FetchStatus } from '../enums/FetchStatus'
import { getResourceState } from '../selectors/fetch'
import { FetchType } from '../reducers/FetchReducer';

const NOT_FOUND = 'not found';

function getLatestTwoNamesOnResource(str: string) {
  const parts = str.split('?')[0].split('/');
  return parts.slice(parts.length - 2).join('/');
}

function apiFetch(url: string) {
  return fetch(url)
    .then((r: any) => {
      if (r.status === 404) {
        return { error: NOT_FOUND };
      }
      if (r.status !== 200) {
        return r.body().then((error: any) => ({ error }));
      }
      return r.json().then((json: any) => ({ result: json }));
    })
    .catch((error: any) => ({ error }));
}

function* fetchData(action: any) {
  const url = action.payload.url;
  const short = getLatestTwoNamesOnResource(url);

  const currentState = yield select(getResourceState(url));
  if (currentState === FetchStatus.Loading) {
    return
  }
  yield put({ fetchType: FetchType.MARK_LOADING, type: 'mark loading ' + short, url });
  const { result, error } = yield call(apiFetch, url);

  if (error) {
    if (error === NOT_FOUND) {
      yield put({ fetchType: FetchType.NOT_FOUND, type: 'not found ' + short, url, payload: error });
    } else {
      yield put({ fetchType: FetchType.ERROR, type: 'error for ' + short, url, payload: error });
    }
  } else {
    yield put({ fetchType: FetchType.SET_RESULT, type: 'set result ' + short, url, payload: result });
  }

  return { result, error }
}

export function fetchSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.fetchRequest, fetchData);
  }
}
