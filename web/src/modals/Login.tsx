import * as React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Action } from 'redux'

const QR = require('react-qr');

import Modal, { ModalVisible, ModalProps } from './Modal'
import Loading from '../components/Loading'
import Actions from '../actions/index'

import './Modal.scss'
import './Login.scss'

interface LoginActions extends ModalProps {
  mockLoginRequest: (id: string) => Action;
}

interface LoginProps {
  requestId: string;
}

class LoginModal extends Modal<LoginActions & LoginProps> {
  modalName = 'login'
  draw() {
    return (
      <div className="modal modal-login">
        <h1>Login to Poet</h1>
        <div>
          { this.props.requestId
            ? <a href="#" onClick={() => this.props.mockLoginRequest(this.props.requestId)}>
               <QR text={this.props.requestId || ''} />
              </a>
            : <Loading />
          }
        </div>
        <div className="mb-2">Scan the QR code to login</div>
        <div className="onboard mb-2">
          <div className="placeholder-box" />
          <div className="ml-2">
            <div><Link to="http://www.po.et/" >Download</Link> the Poet: Authorizer App</div>
            <div className="text-muted">Average onboard takes &lt; 5 minutes</div>
          </div>
        </div>
        <div className="scan">
          <div className="placeholder-box" />
          <div className="ml-2">
            <div>Scan the QR code</div>
            <div className="text-muted">Login to the app &gt; scan QR code</div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state: any): ModalVisible & LoginProps {
  return {
    visible: state.modals.login,
    requestId: state.session.requestId
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.loginModalDisposeRequested }),
  mockLoginRequest: (requestId: string) => ({ type: Actions.mockLoginRequest, payload: requestId })
};

export default connect(mapStateToProps, mapDispatch)(LoginModal);