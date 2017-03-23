import * as React from 'react';

const bitcore = require('bitcore-lib');

import './WalletOperationWithdraw.scss';

interface WalletOperationWithdrawProps {
  address: string
  balance: number
  requestWithdrawal: (_: WalletOperationWithdrawState) => void
}

export interface WalletOperationWithdrawState {
  amountInSatoshis?: number
  paymentAddress?: string
  amountInBTC?: number
  errorAmount?: boolean
  errorAddress?: boolean
}

export class WalletOperationWithdraw extends React.Component<WalletOperationWithdrawProps, WalletOperationWithdrawState> {

  requestWithdrawal = () => {
    const amountInSatoshis = Math.round(parseFloat((''+this.state.amountInBTC)) * 1e8)
    if (amountInSatoshis > this.props.balance) {
      this.setState({ errorAmount: true })
    } else if (!bitcore.Address.isValid(this.state.paymentAddress)) {
      this.setState({ errorAddress: true })
    } else {
      this.props.requestWithdrawal({
        amountInSatoshis,
        paymentAddress: this.state.paymentAddress
      })
    }
  }

  constructor() {
    super(...arguments);
    this.state = {
      amountInBTC: 0,
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
              value={this.state.amountInBTC}
              onChange={(event: any) => this.setState({ amountInBTC: event.target.value })}
              min={0}
            >
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
          <button className="button-secondary" onClick={this.requestWithdrawal}>Withdraw</button>
        </nav>
      </section>
    )
  }

}