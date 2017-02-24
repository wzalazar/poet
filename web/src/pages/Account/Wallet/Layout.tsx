import * as React from 'react';

const QR = require('react-qr');

import './Layout.scss';

import { Transactions } from './Transactions';
import { WithdrawBox } from './WithdrawBox'
import { CopyableText } from '../../../atoms/CopyableText';

interface WalletLayoutProps {
  publicKey?: string;
  address?: string;
  requestWithdrawal?: any;
}

export class WalletLayout extends React.Component<WalletLayoutProps, undefined> {
  render() {
    return (
      <section className="container page-account-wallet">
        <header>
          <h1>Wallet</h1>
        </header>
        <main className="row">
          <div className="col-md-4">
            <section className="wallet-info">
              <section className="balance">
                <div className="primary">$40.00 USD</div>
                <div className="secondary">.0445 BTC</div>
              </section>
              {/*<WithdrawBox address={this.props.address} requestWithdrawal={this.props.requestWithdrawal}/>*/}
              <div className="qr">
                <QR text={this.props.address}/>
              </div>
              <CopyableText text={this.props.address} className="address"/>
              <nav>
                <button className="button-secondary">Open in Desktop Wallet</button>
                <div className="separator">
                  <hr/>
                  <span>or</span>
                  <hr/>
                </div>
                <button className="button-secondary">Deposit with Card</button>
              </nav>

            </section>
          </div>
          <div className="col-md-8">
            <Transactions address={this.props.address}/>
          </div>
        </main>
      </section>
    )
  }
}


