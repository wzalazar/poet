import * as React from "react";
import { Route } from "react-router";
import { Action } from "redux";
import { Saga } from "redux-saga";

import PageLoader, { ReducerDescription } from "../../components/PageLoader";
import { LandingLayout } from "./Layout";

export class LandingLoader extends PageLoader<Object, Object> {

  component = LandingLayout;

  initialState(): Object {
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/" key={key} component={this.container()}/>]
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
    return null;
  }

  select(state: any, ownProps: any): Object {
    return {};
  }
}
