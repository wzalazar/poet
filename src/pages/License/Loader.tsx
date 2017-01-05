import * as React from "react";
import { Action } from "redux";
import { put } from "redux-saga/effects";
import { Route } from "react-router";
import { Saga, takeEvery } from "redux-saga";

import * as constants from "../../constants";
import { LicenseProps, LicenseLayout } from "./Layout";
import { PageLoader, ReducerDescription } from "../../components/PageLoader";

export class License extends PageLoader<number, LicenseProps> {

  component = LicenseLayout;

  initialState() {
    return {
      title: 'Distributed: Markets Event to Convene Blockchain Payments, FinServices Innovator in Atlanta',
      overview: {
        author: 'Satoshi Nakamoto',
        published: (new Date()).toISOString,
        customLabel: 'Some Custom Label',
        tags: 'asd asd asd',
        type: 'License Type'
      }
    };
  }

  routeHook(key: string) {
    return [<Route path="/" key={key} component={this.container()}/>]
  }

  reducerHook<State>(): ReducerDescription<number> {
    return {
      subState: 'License',
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

  select(state: any, ownProps: any): LicenseProps {
    return Object.assign({}, state.license);
  }
}
