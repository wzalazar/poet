import * as React from 'react';

import './Layout.scss';

import { Transactions } from './Transactions';

interface WalletLayoutProps {
  publicKey?: string;
  address?: string;
}

export class WalletLayout extends React.Component<WalletLayoutProps, undefined> {
  private readonly controls: {

  } = {};

  render() {
    return (
      <section className="user-edit">
        <div className="header">
          <h2>Wallet: {this.props.address}</h2>
        </div>
        <Transactions address={this.props.address} />
      </section>
    );
  }

}
