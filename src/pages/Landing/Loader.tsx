import * as React from "react";
import {Action} from "redux";
import {put} from "redux-saga/effects";
import {Route} from "react-router";
import {Saga, takeEvery} from "redux-saga";

import * as constants from "../../constants";
import {PageLoader, ReducerDescription} from "../../components/PageLoader";
import {LandingLayout} from "./Layout";

export class LandingLoader extends PageLoader<Object, Object> {

  component = LandingLayout;

  initialState(): Object{
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<Object> {
    return {
      subState: 'Landing',
      reducer: (state: Object, action: Action) => {
        return state || this.initialState();
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

  select(state: any, ownProps: any): Object {
    return {};
  }
}
