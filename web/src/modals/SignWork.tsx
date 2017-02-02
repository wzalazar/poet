import * as React from 'react'
import { connect } from 'react-redux'

const QR = require('react-qr');

import Modal, { ModalProps } from './Modal'
import Actions from '../actions'
import Loading from '../components/Loading'

import './Modal.scss'
import './Login.scss'

interface SignProps {
  requestId: string;
  visible: boolean;
  success: boolean;
}
interface SignActions {
  mockSign: (id: string) => any
}

class SignWorkModal extends Modal<SignProps & SignActions & ModalProps> {
  draw() {
    if (!this.props.success) {
      return (
        <div className="modal">
          <h1>Signing requested</h1>
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
                <div>Work: El Quijote</div>
                <div className="text-muted">Login to the app &gt; scan QR code</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return (<div className="modal">
      <h1>Claim successfully submited!</h1>
      <div className="mb-2">You will be redirected to an unconfirmed block containing your claim</div>
    </div>
    )
  }
}

function mapStateToProps(state: any): SignProps {
  return {
    visible: state.modals.signWork,
    requestId: state.claimSign.id,
    success: state.claimSign.success
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.claimsModalDismissRequested }),
  mockSign: (id: string) => ({ type: Actions.fakeClaimSign, payload: id })
};

export default connect(mapStateToProps, mapDispatch)(SignWorkModal);