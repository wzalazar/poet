import * as React from 'react';

const QR = require('react-qr');

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
      <section className="user-wallet">
        <div className="header">
          <h2>Wallet: {this.props.address}</h2>
        </div>
        <div className="row">
          <div className="col-4">
            <QR text={this.props.address} />
          </div>
          <div className="col-8">
            <Transactions address={this.props.address} />
          </div>
        </div>
      </section>
    );
  }

}
