import * as React from 'react';

import * as moment from 'moment';

import '../../../extensions/Array';
import { AddressTransactions, AddressTransactionsProps, Transaction } from '../../../hocs/AddressTransactions';

import './Transactions.scss';

import { SelectProfileById } from '../../../components/atoms/Arguments';
import { PoetAPIResourceProvider } from '../../../components/atoms/base/PoetApiResource';
import { UrlObject } from '../../../common';
import { publicKeyToAddress } from '../../../bitcoin/addressHelpers';

const classNames = require('classnames');

type LicenseTransactions = ReadonlyArray<string>;

export const InnerTransactions = AddressTransactions(render);

interface TransactionsHolder {
  transactions: LicenseTransactions
}

function render(props: AddressTransactionsProps & TransactionsHolder) {
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
        { props.txs.map(renderTransaction.bind(this, props.address, props.transactions)) }
      </tbody>
    </table>
  )
}

const DISPLAY_TYPE: { [key: string]: string } = {
  withdrawal: 'Withdrawal from wallet',
  deposit: 'Deposit to wallet',
  earnings: 'Earnings from license sale',
  license: 'License bought'
}

function renderTransaction(address: string, licenseTransactions: LicenseTransactions, transaction: Transaction) {
  let type, color;

  if (transaction.vin.find(vin => vin.addr == address)) {
    type = 'withdrawal';
    color = 'negative'
    if (licenseTransactions.includes(transaction.txid)) {
      type = 'license'
    }
  } else {
    type = 'deposit';
    color = 'positive'
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

export class Transactions extends PoetAPIResourceProvider<LicenseTransactions, SelectProfileById, undefined> {

  renderElement(resource: LicenseTransactions, headers: Headers): JSX.Element {
    const address = publicKeyToAddress(this.props.profileId)
    return <InnerTransactions {...this.props} address={address} transactions={resource} />;
  }

  poetURL(): UrlObject {
    return {
      url: `/licenseTxs`,
      query: {
        profileId: this.props.profileId
      }
    }
  }
}

