import * as React from 'react';
import { Action } from 'redux';
import { Route } from 'react-router';
import { Saga } from 'redux-saga';

import PageLoader, { ReducerDescription } from '../../components/PageLoader';
import { WorkLayout } from './Layout';

interface WorkState {
}

export class Work extends PageLoader<WorkState, Object> {

  component = WorkLayout;

  initialState() {
    return {};
  }


  routeHook(key: string) {
    return [<Route path="/work/:id" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<WorkState> {
    return {
      subState: 'Landing',
      reducer: (state: WorkState, action: Action) => {
        return state || this.initialState();
      }
    }
  }

  sagaHook(): Saga {
    return null;
  }

  select(state: any, ownProps: any): Object {
    return {};
  }
}
