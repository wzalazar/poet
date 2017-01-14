import * as React from 'react';
import { Route } from 'react-router';
import { Saga } from 'redux-saga';

import PageLoader, { ReducerDescription } from '../../components/PageLoader';
import { ProfileLayout } from './Layout';

interface ProfileState {
}

export class Profile extends PageLoader<ProfileState, Object> {

  component = ProfileLayout;

  initialState() {
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/profiles/:id" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<ProfileState> {
    return null;
  }

  sagaHook(): Saga {
    return null;
  }

  select(state: any, ownProps: any): Object {
    return {};
  }
}
