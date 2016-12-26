import { fork, call, put, take } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

function apiFetch(url) {
  return fetch('/api/' + url)
    .then(r => {
      if (r.status === 404) {
        return { error: 'not found' }
      }
      return r.json().then(json => ({ body: json }))
    })
    .catch (err => ({ error: err }))
}

function* fetchData(action) {
  const title = action.payload

  yield put({ type: 'mark loading ' + title })
  const { body, error } = yield call(apiFetch, title)

  if (error) {
    yield put({ type: 'error for ' + title, payload: error })
  } else {
    yield put({ type: 'set result ' + title, payload: body })
  }
}

export default function* watchForGenericCalls() {
  yield takeEvery('API_FETCH_REQUEST', fetchData)
}