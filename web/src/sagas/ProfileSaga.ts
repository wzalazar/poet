import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import { Actions } from '../actions/index'
import config from '../config'

function* fetchProfileData(action: any) {
  const profileResponse = yield call(fetch, config.api.explorer + '/profiles/' + action.profilePublicKey);
  if (profileResponse.status === 200) {
    const profile = yield profileResponse.json();
    yield put({ type: Actions.Profile.ProfileFetched, profile });
  }
}

function profileSaga() {
  return function*() {
    yield takeEvery(Actions.Profile.FetchProfile, fetchProfileData);
  }
}

export default profileSaga;