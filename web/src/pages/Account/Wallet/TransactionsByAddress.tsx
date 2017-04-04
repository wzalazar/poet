import * as React from 'react';
import * as moment from 'moment';
import * as classNames from 'classnames';

import '../../../extensions/Array';

import { Configuration } from '../../../configuration';

import { ResourceProvider } from '../../../components/ResourceProvider';

interface TransactionsByAddressResource {
  readonly pagesTotal: number;
  readonly txs: ReadonlyArray<Transaction>;
}

interface Transaction {
  readonly txid: string;
  readonly version: number;
  readonly locktime: number;
  readonly vin: ReadonlyArray<VIn>;
  readonly vout: ReadonlyArray<VOut>;
  readonly blockhash: string;
  readonly blockheight: number;
  readonly confirmations: number;
  readonly time: number;
  readonly blocktime: number;
  readonly valueOut: number;
  readonly size: number;
  readonly valueIn: number;
  readonly fees: number;
}

interface VIn {
  readonly txid: string;
  readonly vout: number;
  readonly sequence: number;
  readonly n: number;
  readonly scriptSig: ScriptSig;
  readonly addr: string;
  readonly valueSat: number;
  readonly value: number;
  readonly doubleSpentTxID: string;
}

interface VOut {
  readonly value: string;
  readonly n: number;
  readonly scriptPubKey: ScriptPubKey;
  readonly spentTxId: any;
  readonly spentIndex: any;
  readonly spentHeight: any;

}

interface ScriptPubKey {
  readonly hex: string;
  readonly asm: string;
  readonly addresses: ReadonlyArray<string>;
  readonly type: string;
}

interface ScriptSig {
  readonly hex: string;
  readonly asm: string;

}

const DISPLAY_TYPE: { [key: string]: string } = {
  withdrawal: 'Withdrawal from wallet',
  deposit: 'Deposit to wallet',
  earnings: 'Earnings from license sale',
  license: 'License bought'
};

interface TransactionsByAddressProps {
  readonly address: string;
  readonly licenseTransactions: ReadonlyArray<string>;
}

export class TransactionsByAddress extends ResourceProvider<TransactionsByAddressResource, TransactionsByAddressProps, undefined> {

  resourceLocator() {
    return {
      url: `${Configuration.api.insight}/txs?address=${this.props.address}`
    }
  }

  renderElement(transactions: TransactionsByAddressResource) {
    return transactions && transactions.txs && transactions.txs.length ? this.renderTransactions(transactions) : this.renderNoTransactions();
  }

  renderLoading() {
    return <section>Loading your transactions...</section>
  }

  private renderTransactions(transactions: TransactionsByAddressResource) {
    return (
      <table className="transactions">
        <thead>
        <tr>
          <td>Date</td>
          <td>Type</td>
          <td>Amount</td>
        </tr>
        </thead>
        <tbody>
        { transactions.txs.map(this.renderTransaction.bind(this, this.props.address, this.props.licenseTransactions)) }
        </tbody>
      </table>
    )
  }

  private renderTransaction(address: string, licenseTransactions: ReadonlyArray<string>, transaction: Transaction) {
    let type, color;

    if (transaction.vin.some(vin => vin.addr == address)) {
      type = 'withdrawal';
      color = 'negative';
      if (licenseTransactions.includes(transaction.txid)) {
        type = 'license'
      }
    } else {
      type = 'deposit';
      color = 'positive';
      if (licenseTransactions.includes(transaction.txid)) {
        type = 'earnings'
      }
    }

    const valuesIn = transaction.vin.map(vin => vin.value).reduce((a, b) => a + b, 0);
    const valuesOutForMe = transaction.vout.filter(vout => vout.scriptPubKey.addresses[0] === address).map(vout => parseFloat(vout.value)).reduce((a, b) => a + b, 0);

    const value = type === 'deposit' ? valuesOutForMe : valuesIn - valuesOutForMe;

    return (
      <tr key={transaction.txid}>
        <td>{moment(transaction.time * 1000).format('DD-MM-YY [at] HH:mm:ss')}</td>
        <td>{DISPLAY_TYPE[type]}</td>
        <td className={classNames('amount', color)}>{ value.toFixed(8) } BTC</td>
      </tr>
    )
  }

  private renderNoTransactions() {
    return (
      <section>Your transactions will show up here.</section>
    )
  }

}