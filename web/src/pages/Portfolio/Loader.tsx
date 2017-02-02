import * as React from 'react';
import { Route } from 'react-router';
import { Saga } from 'redux-saga';

import PageLoader, { ReducerDescription } from '../../components/PageLoader';
import { PortfolioLayout } from './Layout';

interface PortfolioState {
}

export class Portfolio extends PageLoader<PortfolioState, Object> {

  component = PortfolioLayout;

  initialState() {
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/portfolio" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<PortfolioState> {
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
