import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { browserHistory } from 'react-router';

import { Configuration } from '../configuration';
import Modal, { ModalProps } from './Modal'
import { Actions } from '../actions/index'
import { Images } from '../images/Images';
import { currentPublicKey } from '../selectors/session';
import { publicKeyToAddress } from '../bitcoin/addressHelpers';
import { WalletBalance, UnspentTransactionOutput } from '../atoms/WalletBalance';
import { WorkOffering } from '../atoms/Interfaces';

import './Modal.scss'
import './PurchaseLicense.scss'

interface PurchaseLicenseProps extends ModalProps {
  readonly acceptAction?: () => Action;
  readonly address: string;
  readonly offering: WorkOffering;
  readonly utxos: ReadonlyArray<UnspentTransactionOutput>;
}

class PurchaseLicenseComponent extends Modal<PurchaseLicenseProps, undefined> {

  draw() {
    const satoshis = this.props.utxos && this.props.utxos.map(a => a.satoshis).reduce((a, b) => a + b, 0);
    const btc = satoshis / 100000000;
    const enoughBalance = btc >= parseFloat(this.props.offering.attributes.pricingPriceAmount);

    return (
      <section className="modal modal-purchase-license">
        <h1>Please Pay</h1>
        <div className="wrapper">
          <section className="balance">
            <div className="funds">
              <img src={enoughBalance ? Images.SuccessMarkGreen : Images.FailureMark} />
              <div className="message">You { !enoughBalance && 'don\'t' } have enough funds to pay.</div>
            </div>
            <div className="current-balance">
              <label>Current Balance </label>
              <span><WalletBalance address={this.props.address} /></span>
            </div>
          </section>
          <section className="items">
            <div className="item">
              <label>1x license</label>
              <span>{this.props.offering.attributes.pricingPriceAmount} {this.props.offering.attributes.pricingPriceCurrency}</span>
            </div>
          </section>
          { enoughBalance && <button className="button-primary" onClick={this.props.acceptAction}>Purchase</button> }
          { !enoughBalance && <button className="button-primary" onClick={this.onFundWallet}>Fund Wallet</button> }
        </div>
      </section>
    )
  }

  private onFundWallet = () => {
    this.props.cancelAction();
    browserHistory.push('/account/wallet');
  }

}

function mapStateToProps(state: any): PurchaseLicenseProps {
  const publicKey = currentPublicKey(state);
  const address = publicKey && publicKeyToAddress(publicKey);
  const fetchUtxo = state.fetch[`${Configuration.api.insight}/addr/${address}/utxo`];

  return {
    visible: !!state.modals.purchaseLicense,
    address,
    offering: state.modals.purchaseLicense,
    utxos: fetchUtxo && fetchUtxo.body
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.Modals.PurchaseLicense.Cancel }),
  acceptAction: () => ({ type: Actions.Modals.PurchaseLicense.Accept })
};

export const PurchaseLicense = connect(mapStateToProps, mapDispatch)(PurchaseLicenseComponent);