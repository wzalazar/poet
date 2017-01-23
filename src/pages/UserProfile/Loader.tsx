import * as React from 'react';
import { Route } from 'react-router';
import { Saga, delay, takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';

import PageLoader, { ReducerDescription } from '../../components/PageLoader';
import { ProfileLayout } from './Layout';
import Actions from '../../actions'

export class UserProfile extends PageLoader<any, Object> {

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
      submitProfileRequested: (payload: any[]) => ({
        type: Actions.claimsSubmitRequested, payload
      })
    };
  }
}
