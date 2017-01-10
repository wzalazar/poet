import { Saga, takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import '../extensions/Window'; // TODO: remove once https://github.com/Microsoft/TypeScript/pull/12493 is merged

import Actions from '../actions';

function fetchResponse(type: string, body: any) {
  return { type, body };
}

const fetchResponseSuccess = fetchResponse.bind(null, Actions.fetchResponseSuccess);

const fetchResponseFailure = fetchResponse.bind(null, Actions.fetchResponseError);

function* fetchAction(action: any) {
  try {
    const apiResponse = yield call(window.fetch, action.payload.url);
    const apiResponseJson = yield apiResponse.json();
    yield put(fetchResponseSuccess(apiResponseJson));
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
