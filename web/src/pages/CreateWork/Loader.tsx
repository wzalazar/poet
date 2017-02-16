import * as React from 'react';
import { Route } from 'react-router';
import { Saga } from 'redux-saga';

import PageLoader, { ReducerDescription } from '../../components/PageLoader';
import { CreateWorkLayout } from './Layout';
import Actions from '../../actions/index'
import { currentPublicKey } from '../../selectors/session'

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
    return {
      userName: state.session.userProfile && state.session.userProfile.name,
      userPublicKey: currentPublicKey(state)
    };
  }

  mapDispatchToProps(): Object {
    return {
      createWorkRequested: (payload: any[]) => ({
        type: Actions.claimsSubmitRequested, payload
      })
    };
  }
}
