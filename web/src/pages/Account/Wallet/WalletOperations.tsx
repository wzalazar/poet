import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
const QR = require('react-qr');

import { WithdrawBox } from './WithdrawBox'
import { CopyableText } from '../../../atoms/CopyableText';

import './WalletOperations.scss';

interface WalletOperationsProps {
  readonly address?: string;
  readonly requestWithdrawal?: any;
}

export class WalletOperations extends React.Component<WalletOperationsProps, undefined> {
  render() {
    return (
      <section className="wallet-operations">
        <section className="balance">
          <div className="primary">$40.00 USD</div>
          <div className="secondary">.0445 BTC</div>
        </section>
        <Tabs selectedIndex={0} className="wallet-tabs" >
          <TabList className="wallet-tab-list" activeTabClassName="selected">
            <Tab>Deposit</Tab>
            <Tab>Withdraw</Tab>
          </TabList>
          <TabPanel>
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
          </TabPanel>
          <TabPanel>
            <WithdrawBox address={this.props.address} requestWithdrawal={this.props.requestWithdrawal}/>
          </TabPanel>
        </Tabs>
      </section>
    )
  }
}