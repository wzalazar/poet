import * as React from 'react'
import { HelloWorldProps, HelloWorldComponent } from "./Container"
import { PageLoader, ReducerDescription } from "../../PageLoader"
import { Action } from "redux"
import { Saga, takeEvery } from "redux-saga"
import { put } from "redux-saga/effects"
import { Route } from "react-router"

import ComponentClass = React.ComponentClass

export class HelloWorld extends PageLoader<number, HelloWorldProps> {

  component = HelloWorldComponent;

  initialState(){
    return 5;
  }

  routeHook() {
    return [<Route path="/" component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<number> {
    return {
      subState: 'helloWorld',
      reducer: (counter: number, action: Action) => {
        switch (action.type) {
          case 'increment':
            return counter + 1;
          case 'decrement':
            return counter - 1;
          default:
            return counter || 0
        }
      }
    }
  }

  sagaHook(): Saga {
    function* increment() {
      yield put({ type: 'increment' });
    }
    function* decrement() {
      yield put({ type: 'decrement' });
    }
    return function*() {
      yield takeEvery('increment request', increment);
      yield takeEvery('decrement request', decrement);
    }
  }

  select(state: any, ownProps: any): HelloWorldProps {
    return {
      count: state.count
    }
  }

}
