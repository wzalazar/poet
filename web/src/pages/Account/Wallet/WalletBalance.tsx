import * as React from 'react';

import config from '../../../config';
import { ResourceProvider, ResourceLocator } from '../../../components/ResourceProvider';
import { UnspentTransactionOutputs } from './interfaces';
import { BitcoinToCurrency } from './BitcoinToCurrency';

import './WalletBalance.scss';

export interface WalletBalanceProps {
  readonly address: string;
}

export interface WalletBalanceState {
  readonly btcFirst: boolean;
}

export class WalletBalance extends ResourceProvider<UnspentTransactionOutputs, WalletBalanceProps, WalletBalanceState> {

  constructor() {
    super(...arguments);
    this.state = {
      btcFirst: false
    }
  }

  resourceLocator(): ResourceLocator {
    return {
      url: config.api.insight + '/addr/' + this.props.address + '/utxo'
    }
  }

  renderElement(unspentTransactionOutputs: UnspentTransactionOutputs) {
    const satoshis = unspentTransactionOutputs.map(a => a.satoshis).reduce((a, b) => a + b, 0);
    const btc = satoshis / 100000000;

    return (
      <section className="balance" onClick={() => this.setState({ btcFirst: !this.state.btcFirst })}>
        <div className="primary">
          { this.state.btcFirst ? this.renderBtc(btc) : this.renderForeign(btc) }
        </div>
        <div className="secondary">
          { !this.state.btcFirst ? this.renderBtc(btc) : this.renderForeign(btc) }
        </div>
      </section>
    )
  }

  private renderBtc(btc: number) {
    return <span>{btc.toFixed(8)} BTC</span>
  }

  private renderForeign(btc: number) {
    return <span><BitcoinToCurrency amount={btc} currency="USD" /> USD</span>
  }

}