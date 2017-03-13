import * as React from 'react';
import { Route } from 'react-router';

const Bitcore = require('bitcore-lib');

import PageLoader, { ReducerDescription } from '../../../components/PageLoader';
import { currentPublicKey } from '../../../selectors/session'
import { publicKeyToAddress } from '../../../bitcoin/addressHelpers'
import { Actions } from '../../../actions/index'
import { WalletLayout } from './Layout';
import { WalletOperationWithdrawState } from './WalletOperationWithdraw';

export interface UserWalletProps {
  publicKey?: string;
  address?: string;
}

export class UserWallet extends PageLoader<UserWalletProps, Object> {

  component = WalletLayout;

  initialState() {
    return {};
  }

  routeHook(key: string) {
    return [<Route path="/account/wallet" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<null> {
    return null;
  }

  sagaHook(): any {
    return null;
  }

  select(state: any, ownProps: any): Object {
    const publicKey = currentPublicKey(state);
    const address = publicKey && publicKeyToAddress(publicKey);

    return { publicKey, address };
  }

  mapDispatchToProps(): Object {
    return {
      requestWithdrawal: (info: WalletOperationWithdrawState) => ({
        type: Actions.withdrawalRequested,
        payload: info
      })
    };
  }
}
