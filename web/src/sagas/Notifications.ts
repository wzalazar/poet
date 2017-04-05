import { takeEvery } from 'redux-saga';
import { select } from 'redux-saga/effects';

import { Configuration } from '../configuration';
import { Actions } from '../actions/index';
import { currentPublicKey } from '../selectors/session';

export function notificationsSaga() {
  return function*(){
    yield takeEvery(Actions.Notifications.MarkAllAsRead, markAllAsRead)
  }
}

function* markAllAsRead(action: { type: string, notifications: ReadonlyArray<number>}) {
  const publicKey = yield select(currentPublicKey);
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  fetch(Configuration.api.explorer + '/notifications/' + publicKey, { method: 'PATCH', body: JSON.stringify(action.notifications), headers });
}