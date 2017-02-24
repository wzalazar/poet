import * as React from 'react';
import * as moment from 'moment';

const classNames = require('classnames');

import '../../../extensions/Array';

import { AddressTransactions, AddressTransactionsProps, Transaction } from '../../../hocs/AddressTransactions';

import './Transactions.scss';

function render(props: AddressTransactionsProps) {
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
        { props.txs.map(renderTransaction.bind(this, props.address)) }
      </tbody>
    </table>
  )
}

function renderTransaction(address: string, transaction: Transaction) {
  // TODO: work the deposit/withdrawal logic and value calculation
  let type;

  if (transaction.vin.find(vin => vin.addr == address)) {
    type = 'withdrawal';
  } else {
    type = 'deposit';
  }

  // transaction.vout.find(vout => vout.scriptPubKey.addresses.includes(address))) {

  const valuesIn = transaction.vin.map(vin => vin.value).reduce((a, b) => a + b, 0);
  const valuesOut = transaction.vout.map(vout => parseFloat(vout.value)).reduce((a, b) => a + b, 0);
  const valuesOutForMe = transaction.vout.filter(vout => vout.scriptPubKey.addresses[0] === address).map(vout => parseFloat(vout.value)).reduce((a, b) => a + b, 0);

  const values = valuesOut;

  const value = type === 'deposit' ? valuesOutForMe : valuesIn - valuesOutForMe;

  return (
    <tr key={transaction.txid}>
      <td>{moment().format('DD-MM-YY [at] HH:mm:ss')}</td>
      <td>{type}</td>
      <td className={classNames('amount', value > 0 ? 'positive' : 'negative')}>{value > 0 && '+'}{ value.toFixed(8) } BTC</td>
    </tr>
  )
}

export const Transactions = AddressTransactions(render);