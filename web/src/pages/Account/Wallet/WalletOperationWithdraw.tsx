import * as React from 'react';

import { ResourceProvider, ResourceLocator } from '../../../components/ResourceProvider';
import config from '../../../config';
import { WithdrawalInfo, WithdrawBoxProps, UnspentTransactionOutputs } from './interfaces'

import './WalletOperationWithdraw.scss';

export class WalletOperationWithdraw extends ResourceProvider<UnspentTransactionOutputs, WithdrawBoxProps, WithdrawalInfo> {

  private changeAmount: (ev: any) => any;
  private changeAddress: (ev: any) => any;

  constructor() {
    super(...arguments);
    this.state = {
      amountInSatoshis: 0,
      paymentAddress: ''
    };
    this.changeAmount = (ev: any) => {
      this.setState({ amountInSatoshis: ev.target.value });
    };
    this.changeAddress = (ev: any) => {
      this.setState({ paymentAddress: ev.target.value });
    };
  }

  renderElement(resource: UnspentTransactionOutputs): JSX.Element {
    return (
      <section className="wallet-operation-withdraw">
        <div>
          <label htmlFor="amountInSatoshis">
            <span>Amount to withdraw (fees will be subtracted from this amount)</span>
            <input name="amountInSatoshis"
              defaultValue={'' + this.state.amountInSatoshis}
              onChange={this.changeAmount}>
            </input>
          </label>
        </div>
        <div>
          <label htmlFor="paymentAddress">
            <span>Payment Address</span>
            <input name="paymentAddress"
              defaultValue={this.state.paymentAddress}
              onChange={this.changeAddress}
              placeholder="Payment Address"
            >
            </input>
          </label>
        </div>
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