import * as React from 'react';

import './WalletOperationWithdraw.scss';

interface WalletOperationWithdrawProps {
  address: string
  requestWithdrawal: (_: WalletOperationWithdrawState) => void
}

export interface WalletOperationWithdrawState {
  amountInSatoshis?: number
  paymentAddress?: string
}

export class WalletOperationWithdraw extends React.Component<WalletOperationWithdrawProps, WalletOperationWithdrawState> {

  constructor() {
    super(...arguments);
    this.state = {
      amountInSatoshis: 1,
      paymentAddress: ''
    };
  }

  render() {
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

}