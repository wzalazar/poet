import * as React from 'react';
import { Route } from 'react-router';
import { Saga } from 'redux-saga';

const Bitcore = require('bitcore-lib');

import PageLoader, { ReducerDescription } from '../../components/PageLoader';

import { WalletLayout } from './Layout';

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
    return [<Route path="/user/wallet" key={key} component={this.container()} />]
  }

  reducerHook<State>(): ReducerDescription<null> {
    return null;
  }

  sagaHook(): Saga {
    return null;
  }

  select(state: any, ownProps: any): Object {
    const publicKey = state.session && state.session.token && state.session.token.publicKey;
    const address = publicKey && Bitcore.Address.fromPublicKey(Bitcore.PublicKey(publicKey), Bitcore.Networks.testnet).toString();

    return { publicKey, address };
  }

  mapDispatchToProps(): Object {
    return null;
  }
}
