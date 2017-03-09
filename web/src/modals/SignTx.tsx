import * as React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
const QR = require('react-qr');

import { Images } from '../images/Images';
import Modal, { ModalProps } from './Modal'
import { Actions } from '../actions/index'
import Loading from '../components/Loading'

import './Modal.scss'
import './SignTx.scss'

interface SignProps {
  requestId: string;
  visible: boolean;
  submitting: boolean;
  noBalance: boolean;
  success: boolean;
}
interface SignActions {
  mockSign: (id: string) => any
}

class SignWorkModal extends Modal<SignProps & SignActions & ModalProps, undefined> {
  draw() {
    if (this.props.noBalance)
      return this.renderNoBalance();

    if (this.props.submitting)
      return this.renderLoading();

    if (!this.props.success)
      return this.renderScanRequest();

    return this.renderSuccess();
  }

  private renderNoBalance() {
    return <div className="modal modal-sign-transaction">
      <h1>Signing requested</h1>
      <div>
        <h2>
          Your wallet has no balance.
        </h2>
        <p>
          Please <Link to="/account/wallet" onClick={() => this.props.cancelAction()}>go here</Link> to manage your wallet
        </p>
      </div>
    </div>;
  }

  private renderScanRequest() {
    return (
      <div className="modal modal-sign-transaction">
        <h1>Authorize transaction</h1>
        <div>
          { this.props.requestId
            ? <a href="#" onClick={() => this.props.mockSign(this.props.requestId)}>
            <QR text={this.props.requestId || ''} />
          </a>
            : <Loading />
          }
        </div>
        <div className="mb-2">Scan the QR code to approve</div>
        <div className="onboard mb-2">
          <div className="scan">
            <div className="placeholder-box" />
            <div className="ml-2">
              <div>Buying License</div>
              <div className="text-muted">Login to the app &gt; scan QR code</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  private renderLoading() {
    return (
      <div className="modal modal-sign-transaction loading">
        <img src={Images.Quill} />
      </div>
    )
  }

  private renderSuccess() {
    return (
      <div className="modal">
        <h1>Bitcoin transaction submitted</h1>
      </div>
    )
  }
}

function mapStateToProps(state: any): SignProps {
  return {
    visible: state.modals.signTx,
    requestId: state.signTx.id,
    submitting: state.signTx.submitting,
    success: state.signTx.success,
    noBalance: state.signTx.noBalance
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.Modals.SignTransaction.Hide }),
  mockSign: (id: string) => ({ type: Actions.Transactions.FakeSign, payload: id })
};

export default connect(mapStateToProps, mapDispatch)(SignWorkModal);