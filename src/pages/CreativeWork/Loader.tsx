import * as React from "react";
import { Action } from "redux";
import { Route } from "react-router";
import { Saga } from "redux-saga";

import PageLoader, { ReducerDescription } from "../../components/PageLoader";
import { CreativeWorkLayout } from "./Layout";

interface CreativeWorkState {
}

export class CreativeWork extends PageLoader<CreativeWorkState, Object> {

  component = CreativeWorkLayout;

  initialState() {
    return {
      title: 'Distributed: Markets Event to Convene Blockchain Payments, FinServices Innovator in Atlanta',
      overview: {
        author: 'Satoshi Nakamoto',
        published: (new Date()).toISOString,
        customLabel: 'Some Custom Label',
        tags: 'asd asd asd',
        type: 'License Type'
      },
      content: {
        author: 'Satoshi Nakamoto',
        award: 'Nobel',
        character: 'Han Solo',
      },
      history: {}
    };
  }


  routeHook(key: string) {
    return [<Route path="/claim/:id" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<CreativeWorkState> {
    return {
      subState: 'Landing',
      reducer: (state: CreativeWorkState, action: Action) => {
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
