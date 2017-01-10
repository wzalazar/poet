import * as React from "react";
import {Action} from "redux";
import {put} from "redux-saga/effects";
import {Saga, takeEvery} from "redux-saga";

import Actions from "../../actions";
import {PageLoader, ReducerDescription} from "../../components/PageLoader";
import {UserLayout} from "./Layout";

export interface UserState {
  loggedIn: boolean
};

export class UserLoader extends PageLoader<UserState, undefined> {

  component = UserLayout;

  initialState(){
    return {
      loggedIn: false
    };
  }

  routeHook(key: string): JSX.Element[] {
    return [];
  }

  reducerHook<State>(): ReducerDescription<UserState> {
    return {
      subState: 'currentUser',
      reducer: (state: UserState, action: Action) => {
        switch (action.type) {
          case Actions.loginSuccess:
            return {
              loggedIn: true
            };
          default:
            return state || this.initialState();
        }
      }
    }
  }

  sagaHook(): Saga {
    function* processResponse() {
      yield put({ type: Actions.loginSuccess });
    }
    return function*() {
      yield takeEvery(Actions.userLoginResponse, processResponse);
    }
  }

  select(state: any, ownProps: any): undefined {
    return undefined;
  }
}
