import * as React from 'react'
import { Route } from 'react-router'

import { Configuration } from '../../../config';
import PageLoader, { ReducerDescription } from '../../../components/PageLoader'
import BlockLayout from './Layout'

async function fetchBlocks() {
  return await (await fetch(Configuration.api.explorer + '/blocks')).json()
}

export class SingleBlock extends PageLoader<Object, Object> {

  component = BlockLayout;

  initialState() {
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/blocks/:id" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<null> {
    return null;
  }

  sagaHook(): any {
    return null;
  }

  select(state: any, ownProps: any): Object {
    return { id: ownProps.params.id };
  }

  mapDispatchToProps(): Object {
    return null;
  }
}
