import * as React from "react";
import {Action} from "redux";
import {put} from "redux-saga/effects";
import {Route} from "react-router";
import {Saga, takeEvery} from "redux-saga";

import * as constants from "../../constants";
import {HelloWorldProps, HelloWorldLayout} from "./Layout";
import {PageLoader, ReducerDescription} from "../../components/PageLoader";

export class HelloWorld extends PageLoader<number, HelloWorldProps> {

  component = HelloWorldLayout;

  initialState(){
    return 5;
  }

  routeHook(key: string) {
    return [<Route path="/" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<number> {
    return {
      subState: 'helloWorld',
      reducer: (counter: number, action: Action) => {
        switch (action.type) {
          case constants.increment:
            return counter + 1;
          case constants.decrement:
            return counter - 1;
          default:
            return counter || 0
        }
      }
    }
  }

  sagaHook(): Saga {
    function* increment() {
      yield put({ type: constants.increment });
    }
    function* decrement() {
      yield put({ type: constants.decrement });
    }
    return function*() {
      yield takeEvery(constants.requestIncrement, increment);
      yield takeEvery(constants.requestDecrement, decrement);
    }
  }

  select(state: any, ownProps: any): HelloWorldProps {
    return {
      count: state.helloWorld
    }
  }
}
