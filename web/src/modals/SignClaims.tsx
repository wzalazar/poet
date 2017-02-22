import * as React from "react";
import {connect} from "react-redux";
import Modal, {ModalProps} from "./Modal";
import { Actions } from "../actions/index";
import Loading from "../components/Loading";

const QR = require('react-qr');

import "./Modal.scss";
import "./SignClaims.scss";

interface SignProps {
  readonly requestId: string;
  readonly visible: boolean;
  readonly submitting: boolean;
  readonly success: boolean;
  readonly claimDetails: ReadonlyArray<string>;
}
interface SignActions {
  readonly mockSign: (id: string) => any
}

class SignWorkModal extends Modal<SignProps & SignActions & ModalProps, undefined> {
  draw() {
    return this.props.success ? this.renderSuccess() : this.renderRegister();
  }

  renderRegister() {
    return (
      <section className="modal-sign-work">
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
          <ul className="claim-details">
            { this.props.claimDetails.map( claimDetail => <li>{claimDetail}</li> )}
          </ul>
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
        <h1>Success!</h1>
        <div>You have registered the following creative work</div>
        <ul className="claim-details">
          { this.props.claimDetails.map((claimDetail, index) => <li key={index}>{claimDetail}</li> )}
        </ul>
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
    claimDetails: state.claimSign.details || []
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.Modals.SignClaims.Hide }),
  mockSign: (id: string) => ({ type: Actions.Claims.FakeSign, payload: id })
};

export default connect(mapStateToProps, mapDispatch)(SignWorkModal);