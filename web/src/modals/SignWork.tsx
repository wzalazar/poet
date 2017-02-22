import * as React from "react";
import {connect} from "react-redux";
import Modal, {ModalProps} from "./Modal";
import { Actions } from "../actions/index";
import Loading from "../components/Loading";

const QR = require('react-qr');

import "./Modal.scss";
import "./SignWork.scss";

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
    return this.props.success ? this.renderSuccess() : this.renderRegister();
  }

  renderRegister() {
    return (
      <section className="modal modal-sign-work">
        <header>
          <h1>Scan the code from your <br/>
              Poet: Authenticator App to <br/>
              complete the registration</h1>
          <a href="">Download App</a>
        </header>
        <main>
          <div className="qr">
            { this.props.submitting
              ? <Loading />
              : this.props.requestId
              ? <a href="#" onClick={() => this.props.mockSign(this.props.requestId)}>
              <QR text={this.props.requestId || ''} />
            </a>
              : <Loading />
            }
          </div>
          <h2>This will authorize the following transaction</h2>
          <div className="work">
            <div className="name" >Name: {'Title of the Creative Work'}</div>
            <div className="timestamp">Timestamp: {(new Date()).toISOString()}</div>
          </div>
        </main>
        <nav>
          <button onClick={this.props.cancelAction}>Cancel</button>
        </nav>
      </section>
    )
  }

  renderSuccess() {
    return (
      <div className="modal">
        <h1>Claim successfully submitted!</h1>
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