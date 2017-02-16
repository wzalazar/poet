import * as React from "react";
import {connect} from "react-redux";

import Modal, {ModalProps} from "./Modal";
import Actions from "../actions/index";
import Loading from "../components/Loading";
import { PoetAppState } from '../store/PoetAppState';

import "./Modal.scss";
import "./Login.scss";
import { Config } from '../config';

const Autosuggest = require('react-autocomplete');
const QR = require('react-qr');

interface TransferProps {
  requestId: string;
  targetPublicKey: string;
  visible: boolean;
  success: boolean;
}

interface TransferActions {
  mockSign: (id: string) => any
  selectPublicKey: (id: string) => any
}

function DisplayName(profile: any) {
  return <span>{ profile.displayName }</span>
}

function Value(profile: any) {
  return profile.id
}

interface TransferState {
  loading?: boolean
  suggestions?: ReadonlyArray<any>
  value?: string
}

class SignWorkModal extends Modal<TransferProps & TransferActions & ModalProps, TransferState> {
  constructor() {
    super(...arguments)
    this.state = {
      loading: false,
      suggestions: [],
      value: ''
    }
  }

  reactToUserInput(input: any) {
    this.setState({ loading: true })
    return fetch(Config.api.explorer + '/profiles/autocomplete/' + input)
      .then((result) => {
        this.setState({ loading: false, suggestions: result.body })
      })
  }

  clearValue() {
    this.setState({ loading: false, value: '', suggestions: [] })
  }

  formSubmit() {
    const publicKey = (this.refs.autosuggest as any).value;
    this.props.selectPublicKey(publicKey)
  }

  draw() {
    if (!this.props.targetPublicKey) {
      const { suggestions } = this.state
      const inputProps = {
        value: this.state.value
      }
      return (
        <div className="modal">
          <h1>Who should the transference be made to?</h1>
          <form onSubmit={this.formSubmit.bind(this)}>
          <div>
            {
              <Autosuggest
                ref="autosuggest"
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.reactToUserInput.bind(this)}
                onSuggestionsClearRequested={this.clearValue.bind(this)}
                getSuggestionValue={Value}
                renderSuggestion={DisplayName}
                inputProps={inputProps} />
            }
          </div></form>
        </div>
      )
    } else if (!this.props.success) {
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
          <div className="mb-2">Scan the QR code to approve the transference</div>
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
    return (<div className="modal">
      <h1>Transference executed</h1>
    </div>
    )
  }
}

function mapStateToProps(state: PoetAppState): TransferProps {
  return {
    visible: state.modals.transferProps,
    requestId: state.transfer.id,
    success: state.transfer.success,
    targetPublicKey: state.transfer.targetPublicKey,
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.transferDismissed }),
  mockSign: (id: string) => ({ type: Actions.fakeTransferSign, payload: id }),
  selectPublicKey: (id: string) => ({ type: Actions.setTransferTarget, payload: id })
};

export default connect(mapStateToProps, mapDispatch)(SignWorkModal);