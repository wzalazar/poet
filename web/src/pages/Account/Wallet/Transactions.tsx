import * as React from 'react';
import * as moment from 'moment';

import '../../../extensions/Array';

import { AddressTransactions, AddressTransactionsProps, Transaction } from '../../../hocs/AddressTransactions';

function render(props: AddressTransactionsProps) {
  return (
    <table className="table table-highlight">
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
    type = 'deposit';
  }

  if (transaction.vout.find(vout => vout.scriptPubKey.addresses.includes(address))) {
    type = 'withdrawal';
  }

  const valuesIn = transaction.vin.map(vin => vin.value).reduce((a, b) => a + b, 0);
  const valuesOut = transaction.vout.map(vout => parseFloat(vout.value)).reduce((a, b) => a + b, 0);

  const values = valuesOut;

  return (
    <tr key={transaction.txid}>
      <td>{moment().format()}</td>
      <td>{type}</td>
      <td>{valuesIn} {valuesOut}</td>
    </tr>
  )
}

export const Transactions = AddressTransactions(render);