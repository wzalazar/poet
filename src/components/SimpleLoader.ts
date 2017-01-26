import * as React from 'react'
import { Saga } from 'redux-saga'

import PageLoader from './PageLoader'
import { ReducerDescription } from './PageLoader'

abstract class SimpleLoader extends PageLoader<Object, Object>{

  initialState() {
    return {};
  }

  reducerHook<State>(): ReducerDescription<Object> {
    return null;
  }

  sagaHook(): Saga {
    return null;
  }

  select(state: any, ownProps: any): Object {
    return undefined;
  }
}

export default SimpleLoader
