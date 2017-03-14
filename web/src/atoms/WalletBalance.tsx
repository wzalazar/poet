import * as React from 'react';

import { Configuration } from '../configuration';
import { ClassNameProps } from '../common';
import { ResourceProvider, ResourceLocator } from '../components/ResourceProvider';
import { BitcoinToCurrency } from '../pages/Account/Wallet/BitcoinToCurrency';

export interface WalletBalanceProps extends ClassNameProps {
  readonly address: string;
  readonly dual?: boolean;
}

export interface WalletBalanceState {
  readonly btcFirst: boolean;
}

export interface UnspentTransactionOutput {
  readonly txid: string;
  readonly vout: number;
  readonly satoshis: number;
  readonly confirmations: number;
  readonly ts: number;
  readonly amount: number;
}

type UnspentTransactionOutputs = ReadonlyArray<UnspentTransactionOutput>;

export class WalletBalance extends ResourceProvider<UnspentTransactionOutputs, WalletBalanceProps, WalletBalanceState> {

  constructor() {
    super(...arguments);
    this.state = {
      btcFirst: false
    }
  }

  resourceLocator(): ResourceLocator {
    return {
      url: Configuration.api.insight + '/addr/' + this.props.address + '/utxo'
    }
  }

  renderElement(unspentTransactionOutputs: UnspentTransactionOutputs) {
    const satoshis = unspentTransactionOutputs.map(a => a.satoshis).reduce((a, b) => a + b, 0);
    const btc = satoshis / 100000000;

    return (
      <section className={this.props.className} onClick={() => this.props.dual && this.setState({ btcFirst: !this.state.btcFirst })}>
        { this.props.dual ? this.renderDual(btc) : this.renderSimple(btc) }
      </section>
    )
  }

  private renderSimple(btc: number) {
    return this.renderBtc(btc)
  }

  private renderDual(btc: number) {
    return [
      <div className="primary">
        { this.state.btcFirst ? this.renderBtc(btc) : this.renderForeign(btc) }
      </div>,
      <div className="secondary">
        { !this.state.btcFirst ? this.renderBtc(btc) : this.renderForeign(btc) }
      </div>
    ];
  }

  private renderBtc(btc: number) {
    return <span>{btc.toFixed(8)} BTC</span>
  }

  private renderForeign(btc: number) {
    return <span><BitcoinToCurrency amount={btc} currency="USD" /> USD</span>
  }

}