import * as React from 'react';

import './Layout.scss';

import Transactions from './Transactions';

interface WalletLayoutProps {
  userId?: string;
}

export class WalletLayout extends React.Component<WalletLayoutProps, undefined> {
  private readonly controls: {

  } = {};

  render() {
    return (
      <section className="user-edit">
        <div className="header">
          <h2>Wallet</h2>
        </div>
        <Transactions userId={this.props.userId} />
      </section>
    );
  }

}
