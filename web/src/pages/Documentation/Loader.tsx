import * as React from 'react';
import { Route } from 'react-router';
import { Saga } from 'redux-saga';

import PageLoader, { ReducerDescription } from '../../components/PageLoader';
import { DocumentationLayout } from './Layout';

interface DocumentationState {

}

export class Documentation extends PageLoader<DocumentationState, Object> {

  component = DocumentationLayout;

  initialState() {
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/documentation" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<DocumentationState> {
    return null;
  }

  sagaHook(): Saga {
    return null;
  }

  select(state: any, ownProps: any): Object {
    return {};
  }
}
