import * as React from 'react';
import { Action } from 'redux';
import { Route } from 'react-router';
import { Saga } from 'redux-saga';

import PageLoader, { ReducerDescription } from '../../components/PageLoader';
import { CreativeWorkLayout } from './Layout';

interface CreativeWorkState {
}

export class CreativeWork extends PageLoader<CreativeWorkState, Object> {

  component = CreativeWorkLayout;

  initialState() {
    return {};
  }


  routeHook(key: string) {
    return [<Route path="/creative_work/:id" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<CreativeWorkState> {
    return {
      subState: 'Landing',
      reducer: (state: CreativeWorkState, action: Action) => {
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
