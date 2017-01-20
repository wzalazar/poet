import * as React from 'react';
import { Route } from 'react-router';
import { Saga } from 'redux-saga';

import PageLoader, { ReducerDescription } from '../../components/PageLoader';
import { CreateWorkLayout } from './Layout';

interface CreateWorkState {
}

export class CreateWork extends PageLoader<CreateWorkState, Object> {

  component = CreateWorkLayout;

  initialState() {
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/create-work" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<CreateWorkState> {
    return null;
  }

  sagaHook(): Saga {
    return null;
  }

  select(state: any, ownProps: any): Object {
    if (!state.session || !state.session.user || !state.session.user.id)
      return {};

    return { userId: state.session.user.id };
  }
}
