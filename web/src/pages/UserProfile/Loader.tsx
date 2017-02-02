import * as React from 'react';
import { Route } from 'react-router';
import { Saga, delay, takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';

import { Claim } from '../../Claim';
import Actions from '../../actions'
import PageLoader, { ReducerDescription } from '../../components/PageLoader';

import { ProfileLayout, UserProfileProps } from './Layout';

export class UserProfile extends PageLoader<UserProfileProps, Object> {

  component = ProfileLayout;

  initialState() {
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/user/profile" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<null> {
    return null;
  }

  sagaHook(): Saga {
    function* updateProfile() {
      yield put(Actions.updatingProfile);
      yield delay(2000);
      yield put(Actions.profileUpdated);
    }
    return function*() {
      yield takeEvery(Actions.updateProfileRequested, updateProfile);
    };
  }

  select(state: any, ownProps: any): Object {
    const { displayName = '', imageData = '', email = '', currency = '' } = state.profile && state.profile.attributes || {};

    return {
      id: ownProps.params.id,
      displayName,
      avatarImageData: imageData,
      email,
      currency
    };
  }

  mapDispatchToProps(): Object {
    return {
      submitProfileRequested: (payload: Claim) => ({
        type: Actions.claimsSubmitRequested, payload: [payload]
      })
    };
  }
}
