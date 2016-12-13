import { fork, call, put, take } from 'redux-saga/effects'

function apiFetch(url) {
  return fetch('/api/' + url)
    .then(r => r.json())
}

export default function* watchForGenericCalls() {
  while (true) {
    const fetchData = yield take('API_FETCH_REQUEST')
    const title = fetchData.payload

    yield put({ type: 'mark loading ' + title })
    try {
      const body = yield call(apiFetch, title)
      yield put({ type: 'set result ' + title, payload: body })
    } catch (error) {
      yield put({ type: 'errored ' + title, payload: error })
    }
  }
}