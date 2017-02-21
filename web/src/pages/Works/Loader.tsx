import * as React from 'react';
import { Route } from 'react-router';
import { Saga } from 'redux-saga';

import PageLoader, { ReducerDescription } from '../../components/PageLoader';
import { WorksLayout } from './Layout';

interface WorkState {
}

export class Works extends PageLoader<WorkState, Object> {

  component = WorksLayout;

  initialState() {
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/works" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<WorkState> {
    return null;
  }

  sagaHook(): Saga {
    return null;
  }

  select(state: any, ownProps: any): Object {
    return {
      query: state.navbar && state.navbar.searchQuery || ''
    };
  }
}
