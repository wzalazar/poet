import * as React from 'react';
import { Route } from 'react-router';

import PageLoader, { ReducerDescription } from '../../components/PageLoader';
import { AboutLayout } from './Layout';

interface AboutState {

}

export class About extends PageLoader<AboutState, Object> {

  component = AboutLayout;

  initialState() {
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/about" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<AboutState> {
    return null;
  }

  sagaHook(): any {
    return null;
  }

  select(state: any, ownProps: any): Object {
    return {};
  }
}
