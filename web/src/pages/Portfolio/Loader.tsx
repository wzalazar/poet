import * as React from 'react';
import { Route } from 'react-router';

import PageLoader, { ReducerDescription } from '../../components/PageLoader';
import { PortfolioLayout } from './Layout';
import { currentPublicKey } from '../../selectors/session';
import { SelectProfileById } from '../../components/atoms/Arguments';
import { Actions } from '../../actions/index';

export class Portfolio extends PageLoader<null, SelectProfileById> {

  component = PortfolioLayout;

  initialState(): null {
    return null;
  }

  routeHook(key: string) {
    return [<Route path="/portfolio" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<null> {
    return null;
  }

  sagaHook(): any {
    return null;
  }

  select(state: any, ownProps: any) {
    return { profileId: currentPublicKey(state) }
  }

  mapDispatchToProps(): Object {
    return {
      transferRequested: (workId: string) => ({
        type: Actions.Transfer.TransferRequested, workId
      })
    };
  }
}
