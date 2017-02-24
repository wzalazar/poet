import * as React from 'react';
const QR = require('react-qr');

import { CopyableText } from '../../../atoms/CopyableText';

import './WalletOperationDeposit.scss';

interface WalletOperationDepositProps {
  readonly address: string;
}

export function WalletOperationDeposit(props: WalletOperationDepositProps) {
  return (
    <div className="wallet-operation-deposit">
      <div className="qr">
        <QR text={props.address}/>
      </div>
      <CopyableText text={props.address} className="address"/>
      <nav>
        <button className="button-secondary">Open in Desktop Wallet</button>
        <div className="separator">
          <hr/>
          <span>or</span>
          <hr/>
        </div>
        <button className="button-secondary">Deposit with Card</button>
      </nav>
    </div>
  )
}