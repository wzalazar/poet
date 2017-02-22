import * as React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'

import Modal, { ModalProps } from './Modal'
import Actions from '../actions/index'

import './Modal.scss'
import './PurchaseLicense.scss'
import { ActionsTwo } from '../actions/index';

const successMarkUrl = 'https://cdn3.iconfinder.com/data/icons/stroke/53/Button-Check-512.png';

interface PurchaseLicenseProps extends ModalProps {
  acceptAction?: () => Action;
}

class PurchaseLicenseComponent extends Modal<PurchaseLicenseProps, undefined> {

  draw() {
    return (
      <section className="modal modal-purchase-license">
        <h1>Please Pay</h1>
        <div className="wrapper">
          <section className="balance">
            <div className="funds">
              <img src={successMarkUrl} />
              <div className="message">
                <div>You have enough funds to pay.</div>
                <a href="#">Add more</a>
              </div>
            </div>
            <div className="current-balance">
              <label>Current Balance</label>
              <span>$20.00</span>
            </div>
          </section>
          <section className="items">
            <div className="item">
              <label>1x license for cw#00000</label>
              <span>$10.00</span>
            </div>
          </section>
          <button className="button-primary" onClick={this.props.acceptAction}>Purchase</button>
        </div>
      </section>
    )
  }

}

function mapStateToProps(state: any): PurchaseLicenseProps {
  return {
    visible: !!state.modals.purchaseLicense
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: ActionsTwo.Modals.purchaseLicenseModalCancel }),
  acceptAction: () => ({ type: Actions.purchaseLicenseModalAccept })
};

export const PurchaseLicense = connect(mapStateToProps, mapDispatch)(PurchaseLicenseComponent);