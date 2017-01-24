import * as React from 'react';
import { Route } from 'react-router';
import { Action } from 'redux';
import { Saga, delay, takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';

import { Claim } from '../../Claim';
import Actions from '../../actions'
import PageLoader, { ReducerDescription } from '../../components/PageLoader';

import { ProfileLayout } from './Layout';

export interface UserProfileProps {
  readonly displayName?: string;
  readonly email?: string;
  readonly avatarImageData?: string;
  readonly currency?: string;
  readonly submitProfileRequested?: (payload: Claim) => Action;
}

export class UserProfile extends PageLoader<UserProfileProps, Object> {

  component = ProfileLayout;

  initialState() {
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/user" key={key} component={this.container()} />]
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
    return { id: ownProps.params.id };
  }

  mapDispatchToProps(): Object {
    return {
      submitProfileRequested: (payload: Claim) => ({
        type: Actions.claimsSubmitRequested, payload: [payload]
      })
    };
  }
}
