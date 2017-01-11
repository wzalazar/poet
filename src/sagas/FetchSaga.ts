import { Saga, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import '../extensions/Window'; // TODO: remove once https://github.com/Microsoft/TypeScript/pull/12493 is merged

import Actions from '../actions';

function fetchResponse(type: string, url: string, body: any) {
  return { type, url, body };
}

const fetchResponseSuccess = fetchResponse.bind(null, Actions.fetchResponseSuccess);

const fetchResponseFailure = fetchResponse.bind(null, Actions.fetchResponseError);

function* fetchAction(action: any) {
  try {
    const response = yield call(window.fetch, action.payload.url); // TODO: cache fetch response!
    const responseJson = yield response.json();
    yield put(fetchResponseSuccess(action.payload.url, responseJson));
  } catch (e) {
    yield put(fetchResponseFailure(e.message));
  }
}

function fetchSaga(): Saga {
  return function*() {
    yield takeEvery(Actions.fetchRequest, fetchAction);
  }
}

export default fetchSaga;
