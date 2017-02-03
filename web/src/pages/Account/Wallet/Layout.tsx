import * as React from 'react';

const QR = require('react-qr');

import './Layout.scss';

import { Transactions } from './Transactions';
import { WithdrawBox } from './WithdrawBox'

interface WalletLayoutProps {
  publicKey?: string;
  address?: string;
  requestWithdrawal?: any;
}

export class WalletLayout extends React.Component<WalletLayoutProps, undefined> {
  render() {
    return (
      <section className="user-wallet">
        <div className="header">
          <h2>Wallet: {this.props.address}</h2>
        </div>
        <div className="row">
          <div className="col-md-4 text-center">
            <QR text={this.props.address} />
            <WithdrawBox address={this.props.address} requestWithdrawal={this.props.requestWithdrawal} />
          </div>
          <div className="col-md-8">
            <Transactions address={this.props.address} />
          </div>
        </div>
      </section>
    );
  }

}
