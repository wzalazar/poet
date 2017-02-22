import * as React from "react";
import {connect} from "react-redux";
import Modal, {ModalProps} from "./Modal";
import { Actions } from "../actions/index";
import Loading from "../components/Loading";
import "./Modal.scss";
import "./Login.scss";

const QR = require('react-qr');

interface SignProps {
  requestId: string;
  visible: boolean;
  submitting: boolean;
  success: boolean;
}
interface SignActions {
  mockSign: (id: string) => any
}

class SignWorkModal extends Modal<SignProps & SignActions & ModalProps, undefined> {
  draw() {
    return this.props.success ? this.renderSuccess() : this.renderModal();
  }

  renderModal() {
    return (
      <div className="modal">
        <h1>Signing requested</h1>
        <div>
          { this.props.submitting
            ? <Loading />
            : this.props.requestId
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
              <div className="text-muted">Login to the app &gt; scan QR code</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderSuccess() {
    return (
      <div className="modal">
        <h1>Claim successfully submited!</h1>
      </div>
    );
  }
}

function mapStateToProps(state: any): SignProps {
  return {
    visible: state.modals.signWork,
    requestId: state.claimSign.id,
    success: state.claimSign.success,
    submitting: state.claimSign.submitting,
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.Modals.SignClaims.Hide }),
  mockSign: (id: string) => ({ type: Actions.Claims.FakeSign, payload: id })
};

export default connect(mapStateToProps, mapDispatch)(SignWorkModal);