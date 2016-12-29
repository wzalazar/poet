import { call, put } from 'redux-saga/effects'
import { takeEvery } from 'redux-saga'

import { io } from './events'

function apiFetch(url) {
  return fetch('/api/' + url)
    .then(r => {
      if (r.status === 404) {
        return { error: 'not found' }
      }
      if (r.status !== 200) {
        return r.body().then(error => ({ error }))
      }
      return r.json().then(json => ({ body: json }))
    })
    .catch(error => ({ error }))
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

function* sendWebsocket(action) {
  io.send(action.payload)
  yield put({ type: 'clear for all_blocks' })
}

export default function* watchForGenericCalls() {
  yield takeEvery('API_FETCH_REQUEST', fetchData)
  yield takeEvery('send websocket message', sendWebsocket)
}