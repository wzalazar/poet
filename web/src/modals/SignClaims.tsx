import * as React from "react";
import {connect} from "react-redux";

import { Claim, WORK, PROFILE } from '../Claim';
import Modal, {ModalProps} from "./Modal";
import { Actions } from "../actions/index";
import { WorkDetails } from '../atoms/WorkDetails';
import Loading from "../components/Loading";

const QR = require('react-qr');

import "./Modal.scss";
import "./SignClaims.scss";

interface SignProps {
  readonly requestId: string;
  readonly visible: boolean;
  readonly submitting: boolean;
  readonly success: boolean;
  readonly claims: ReadonlyArray<Claim>;
}
interface SignActions {
  readonly mockSign: (id: string) => any
}

class SignWorkModal extends Modal<SignProps & SignActions & ModalProps, undefined> {
  draw() {
    const workClaim = this.props.claims.find(claim => claim.type === WORK);
    const profileClaim = this.props.claims.find(claim => claim.type === PROFILE);

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

          { workClaim && <WorkDetails
            work={workClaim}
            className="claim-details"
            name timestamp
          /> }

          { profileClaim && <ul className="claim-details">
            <li>Profile Update</li>
          </ul> }

        </main>
        <nav>
          <button onClick={this.props.cancelAction}>Cancel</button>
        </nav>
      </section>
    )
  }

}

function mapStateToProps(state: any): SignProps {
  return {
    visible: state.modals.signWork,
    requestId: state.claimSign.id,
    success: state.claimSign.success,
    submitting: state.claimSign.submitting,
    claims: state.claimSign.claims || []
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.Modals.SignClaims.Hide }),
  mockSign: (id: string) => ({ type: Actions.Claims.FakeSign, payload: id })
};

export default connect(mapStateToProps, mapDispatch)(SignWorkModal);