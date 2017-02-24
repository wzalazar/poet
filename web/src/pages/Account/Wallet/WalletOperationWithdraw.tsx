import * as React from 'react';

import { ResourceProvider, ResourceLocator } from '../../../components/ResourceProvider';
import config from '../../../config';
import { WithdrawalInfo, WithdrawBoxProps, UnspentTransactionOutputs } from './interfaces'

import './WalletOperationWithdraw.scss';

export class WalletOperationWithdraw extends ResourceProvider<UnspentTransactionOutputs, WithdrawBoxProps, WithdrawalInfo> {

  constructor() {
    super(...arguments);
    this.state = {
      amountInSatoshis: 1,
      paymentAddress: ''
    };
  }

  renderElement(resource: UnspentTransactionOutputs): JSX.Element {
    return (
      <section className="wallet-operation-withdraw">
        <main>
          <div className="input">
            <label>Amount to withdraw</label>
            <input
              type="number"
              name="amountInSatoshis"
              value={this.state.amountInSatoshis}
              onChange={(event: any) => this.setState({ amountInSatoshis: event.target.value })}
              min={1}>
            </input>
            <small>Fees will be subtracted from this amount</small>
          </div>
          <div className="input">
            <label>Payment Address</label>
            <input
              type="text"
              name="paymentAddress"
              value={this.state.paymentAddress}
              onChange={(event: any) => this.setState({ paymentAddress: event.target.value })}
              placeholder="Payment Address">
            </input>
          </div>
        </main>
        <nav>
          <button className="button-secondary" onClick={() => this.props.requestWithdrawal(this.state)}>Withdraw</button>
        </nav>
      </section>
    )
  }

  resourceLocator(): ResourceLocator {
    return {
      url: config.api.insight + '/addr/' + this.props.address + '/utxo'
    }
  }
}