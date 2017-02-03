import * as React from 'react';

import { ResourceProvider, ResourceLocator } from '../../../components/ResourceProvider';
import config from '../../../config';
import { WithdrawalInfo, WithdrawBoxProps, UnspentTransactionOutputs } from './interfaces'
import { BalanceBox } from './components/BalanceBox'

export class WithdrawBox extends ResourceProvider<UnspentTransactionOutputs, WithdrawBoxProps, WithdrawalInfo> {

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
    return (<div className="text-left">
      <BalanceBox outputs={resource} />
      <p>
        <label htmlFor="amountInSatoshis">
          Amount to withdraw (fees will be substracted from this amount)
        <input name="amountInSatoshis"
          defaultValue={'' + this.state.amountInSatoshis}
          onChange={this.changeAmount}>
        </input>
        </label>
      </p>
      <p>
        <label htmlFor="paymentAddress">
          Payment Address
        <input name="paymentAddress"
          defaultValue={this.state.paymentAddress}
          onChange={this.changeAddress}
          placeholder="Payment Address"
        >
        </input>
        </label>
      </p>
      <p><button onClick={() => this.props.requestWithdrawal(this.state)}>Withdraw</button></p>
    </div>)
  }

  resourceLocator(): ResourceLocator {
    return {
      url: config.api.insight + '/addr/' + this.props.address + '/utxo'
    }
  }
}