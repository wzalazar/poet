import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'

import Modal, { ModalProps } from './Modal'
import { Actions } from '../actions/index'
import { Images } from '../images/Images';
import { currentPublicKey } from '../selectors/session';
import { publicKeyToAddress } from '../bitcoin/addressHelpers';
import { WalletBalance } from '../atoms/WalletBalance';
import { WorkOffering } from '../atoms/Interfaces';

import './Modal.scss'
import './PurchaseLicense.scss'

interface PurchaseLicenseProps extends ModalProps {
  readonly acceptAction?: () => Action;
  readonly address: string;
  readonly offering: WorkOffering;
}

class PurchaseLicenseComponent extends Modal<PurchaseLicenseProps, undefined> {

  draw() {
    return (
      <section className="modal modal-purchase-license">
        <h1>Please Pay</h1>
        <div className="wrapper">
          <section className="balance">
            <div className="funds">
              <img src={Images.SuccessMark} />
              <div className="message">
                <div>You have enough funds to pay.</div>
                <a href="#">Add more</a>
              </div>
            </div>
            <div className="current-balance">
              <label>Current Balance</label>
              <span><WalletBalance address={this.props.address} /></span>
            </div>
          </section>
          <section className="items">
            <div className="item">
              <label>1x license for cw#00000</label>
              <span>{this.props.offering.attributes.pricingPriceAmount} {this.props.offering.attributes.pricingPriceCurrency}</span>
            </div>
          </section>
          <button className="button-primary" onClick={this.props.acceptAction}>Purchase</button>
        </div>
      </section>
    )
  }

}

function mapStateToProps(state: any): PurchaseLicenseProps {
  const publicKey = currentPublicKey(state);
  const address = publicKey && publicKeyToAddress(publicKey);

  return {
    visible: !!state.modals.purchaseLicense,
    address,
    offering: state.modals.purchaseLicense
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.Modals.PurchaseLicense.Cancel }),
  acceptAction: () => ({ type: Actions.Modals.PurchaseLicense.Accept })
};

export const PurchaseLicense = connect(mapStateToProps, mapDispatch)(PurchaseLicenseComponent);