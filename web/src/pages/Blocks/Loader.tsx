import * as React from 'react'
import { Route } from 'react-router'
import { Saga } from 'redux-saga'
import { select, call, put } from 'redux-saga/effects'

import PageLoader, { ReducerDescription } from '../../components/PageLoader'
import BlockLayout from './Layout'
import config from '../../config'
import { Actions } from '../../actions/index'

async function fetchBlocks() {
  return await (await fetch(config.api.explorer + '/blocks')).json()
}

export class Blocks extends PageLoader<Object, Object> {

  component = BlockLayout;

  initialState() {
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/blocks" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<null> {
    return null;
  }

  sagaHook(): Saga {
    return function* rootSaga() {
      const blockInfo = yield select(Blocks.select);
      if (!blockInfo.length) {
        const blockInfo = yield call(fetchBlocks);
        yield put({ type: Actions.blockInfoReceived, payload: blockInfo })
      }
    };
  }

  select(state: any, ownProps: any): Object {
    return Blocks.select(state, ownProps);
  }

  static select(state: any, ownProps: any): Object {
    return { blocks: state.blocks };
  }

  mapDispatchToProps(): Object {
    return null;
  }
}
