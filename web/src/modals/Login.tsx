import * as React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Action } from 'redux'

const QR = require('react-qr');

import Modal, { ModalVisible, ModalProps } from './Modal'
import Loading from '../components/Loading'
import { Actions } from '../actions/index'

import './Modal.scss'
import './Login.scss'

interface LoginActions extends ModalProps {
  mockLoginRequest: (id: string) => Action;
}

interface LoginProps {
  requestId: string;
}

class LoginModal extends Modal<LoginActions & LoginProps, undefined> {
  modalName = 'login';

  draw() {
    return (
      <div className="modal modal-login">
        <header>
          <h1>You must login to register</h1>
        </header>
        <section>
          <div className="qr">
            { this.props.requestId
              ? <a href="#" onClick={() => this.props.mockLoginRequest(this.props.requestId)}>
              <QR text={this.props.requestId || ''} />
            </a>
              : <Loading />
            }
          </div>
          <h2>Scan the QR code to login</h2>
          <div className="onboard">
            <div className="placeholder-box" />
            <div className="">
              <h3><Link to="http://www.po.et/" >Download</Link> the Poet: Authorizer App</h3>
              <div className="text-muted">Average onboard takes &lt; 5 minutes</div>
            </div>
          </div>
          <div className="scan">
            <div className="placeholder-box" />
            <div className="">
              <h3>Scan the QR code</h3>
              <div className="text-muted">Login to the app &gt; scan QR code</div>
            </div>
          </div>
        </section>
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