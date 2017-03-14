import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import { Configuration } from '../configuration';
import { Actions } from '../actions/index'

function* fetchProfileData(action: any) {
  const profileResponse = yield call(fetch, Configuration.api.explorer + '/profiles/' + action.profilePublicKey);
  if (profileResponse.status === 200) {
    const profile = yield profileResponse.json();
    yield put({ type: Actions.Profile.ProfileFetched, profile });
  }

  const notificationsResponse = yield call(fetch, Configuration.api.explorer + '/notifications/' + action.profilePublicKey);
  if (notificationsResponse.status === 200) {
    const unreadCount = notificationsResponse.headers.get('x-unread')
    const totalCount = notificationsResponse.headers.get('x-total-count')
    const notifications = yield notificationsResponse.json();
    yield put({ type: Actions.Profile.NotificationsUpdate, payload: { notifications, unreadCount, totalCount } });
  }
}

function profileSaga() {
  return function*() {
    yield takeEvery(Actions.Profile.FetchProfile, fetchProfileData);
  }
}

export default profileSaga;