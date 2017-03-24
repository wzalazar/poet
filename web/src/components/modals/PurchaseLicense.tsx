import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { browserHistory } from 'react-router';
import * as moment from 'moment'

import { Configuration } from '../../configuration';
import { WorkOffering, Work } from '../../Interfaces';
import { Actions } from '../../actions/index'
import { Images } from '../../images/Images';
import { currentPublicKey } from '../../selectors/session';
import { publicKeyToAddress } from '../../bitcoin/addressHelpers';
import { WalletBalance, UnspentTransactionOutput } from '../atoms/WalletBalance';
import Modal, { ModalProps } from './Modal'

import './PurchaseLicense.scss'
import { AuthorWithLink } from '../atoms/Work';
import { badge } from '../LicenseBadge';

interface PurchaseLicenseProps extends ModalProps {
  readonly success: boolean;
  readonly acceptAction?: () => Action;
  readonly address: string;
  readonly offering: WorkOffering;
  readonly work: Work;
  readonly resultId?: string;
  readonly utxos: ReadonlyArray<UnspentTransactionOutput>;
}

class PurchaseLicenseComponent extends Modal<PurchaseLicenseProps, undefined> {
  private textarea: HTMLTextAreaElement;

  draw() {
    return !this.props.success ? this.renderBla() : this.renderSuccess();
  }

  private renderBla() {
    const satoshis = this.props.utxos && this.props.utxos.map(a => a.satoshis).reduce((a, b) => a + b, 0);
    const btc = satoshis / 100000000;
    const enoughBalance = btc >= parseFloat(this.props.offering.attributes.pricingPriceAmount);

    return (
      <section className="modal-purchase-license">
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

  private renderSuccess() {

    return (
      <section className="modal-purchase-license-success">
        <header>
          <h1>{ this.props.work && this.props.work.attributes.name }</h1>
          <h2>Original Author: <AuthorWithLink work={this.props.work} /></h2>
        </header>
        <main>
          <div className="row">
            <div className="col-sm-3"><label>Message</label></div>
            <div className="col-sm-9">
              <div className="iframe">
                <textarea value={badge(this.props.resultId, moment().format(Configuration.dateTimeFormat))} ref={textarea => this.textarea = textarea} />
                <button onClick={this.onCopy}>Copy</button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-3"><label>Preview</label></div>
            <div className="col-sm-9">
              <div className="badge">
                <div className="image-wrapper">
                  <img src={Images.Badge} />
                </div>
                <div className="data">
                  <h3>Licensed via po.et</h3>
                  <time>4.15.16  9:30 AM</time>
                </div>
              </div>
            </div>
          </div>
        </main>
        <nav>
          <small>This will always be availible from your profile > license</small>
          <button className="button-primary" onClick={this.props.cancelAction}>Done</button>
        </nav>
      </section>
    )
  }

  private onFundWallet = () => {
    this.props.cancelAction();
    browserHistory.push('/account/wallet');
  };

  private onCopy = () => {
    this.textarea.select();
    document.execCommand('copy');
  };

}

function mapStateToProps(state: any): PurchaseLicenseProps {
  const publicKey = currentPublicKey(state);
  const address = publicKey && publicKeyToAddress(publicKey);
  const fetchUtxo = state.fetch[`${Configuration.api.insight}/addr/${address}/utxo`];

  return {
    visible: state.modals.purchaseLicense && state.modals.purchaseLicense.visible,
    success: state.modals.purchaseLicense && state.modals.purchaseLicense.success,
    address,
    offering: state.modals.purchaseLicense && state.modals.purchaseLicense.offering,
    work: state.modals.purchaseLicense && state.modals.purchaseLicense.work,
    resultId: state.modals.purchaseLicense && state.modals.purchaseLicense.resultId,
    utxos: fetchUtxo && fetchUtxo.body
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.Modals.PurchaseLicense.Cancel }),
  acceptAction: () => ({ type: Actions.Modals.PurchaseLicense.Accept })
};

export const PurchaseLicense = connect(mapStateToProps, mapDispatch)(PurchaseLicenseComponent);