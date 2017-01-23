import { ModalVisible } from './Modal'

import * as React from 'react';
import { connect } from 'react-redux';

import Modal from './Modal'
import { ModalProps } from './Modal'

import Actions from '../actions';

import './Modal.scss';
import './Login.scss';

class SignWorkModal extends Modal<ModalProps> {
  draw() {
    return (
      <div className="modal">
        <h1>Signing requested</h1>
        <div>
          <img src="http://www.qr-code-generator.com/phpqrcode/getCode.php?cht=qr&chl=http%3A%2F%2Fwww.po.et&chs=180x180&choe=UTF-8&chld=L|0"/>
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
}

function mapStateToProps(state: any): ModalVisible {
  return {
    visible: state.modals.signWork
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.claimsModalDismissRequested }),
};

export default connect(mapStateToProps, mapDispatch)(SignWorkModal);