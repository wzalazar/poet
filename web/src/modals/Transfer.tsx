import * as React from "react";
import {connect} from "react-redux";

import Modal, {ModalProps} from "./Modal";
import { Actions } from "../actions/index";
import Loading from "../components/Loading";
import { PoetAppState } from '../store/PoetAppState';


import "./Modal.scss";
import "./Login.scss";
import { Config } from '../config';

const Autocomplete = require('react-autocomplete');
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
  return <div
    key={profile.id}
    id={profile.id}
    style={{
      display: 'block',
      position: 'relative',
      color: 'black',
      background: 'white'
    }}
  >{ profile.displayName }</div>
}

function Value(profile: any) {
  return profile.id
}

interface TransferState {
  loading?: boolean
  suggestions?: ReadonlyArray<any>
  value?: string
  selected?: any
}

class TransferModal extends Modal<TransferProps & TransferActions & ModalProps, TransferState> {
  constructor() {
    super(...arguments)
    this.state = {
      selected: null,
      loading: false,
      suggestions: [],
      value: ''
    }
  }

  reactToUserInput(input: any) {
    this.setState({ loading: true, value: input })
    return fetch(Config.api.explorer + '/profiles/autocomplete/' + input)
      .then(result => result.json())
      .then((result: any) => {
        this.setState({ loading: false, suggestions: result })
      })
  }

  clearValue() {
    this.setState({ loading: false, value: '', suggestions: [] })
  }

  formSubmit() {
    const publicKey = Value(this.state.selected)
    this.props.selectPublicKey(publicKey)
    this.setState({ loading: false, suggestions: [], value: '' })
  }

  draw() {
    if (!this.props.targetPublicKey) {
      const { suggestions, value } = this.state
      const inputProps = {
        value: value,
        style: { "border": "1px solid black" }
      }
      return (
        <div className="modal">
          <h1>Who should the transference be made to?</h1>
          <form onSubmit={this.formSubmit.bind(this)}>
          <div>
            {
              <Autocomplete
                ref="autocomplete"
                items={suggestions}
                value={value}
                onSelect={(value: string, item: any) => {
                  this.setState({ selected: item, value }, () => this.formSubmit())
                }}
                onChange={(event: any, value: string) => {
                  this.reactToUserInput(value)
                }}
                getItemValue={Value}
                renderMenu={(children: any) =>
                  <div style={{ position: 'absolute', width: '100%' }}>
                    {children}
                  </div>
                }
                wrapperStyle={{ position: 'relative', display: 'inline-block' }}
                renderItem={DisplayName}
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
    visible: state.modals.transfer,
    requestId: state.transfer.id,
    success: state.transfer.success,
    targetPublicKey: state.transfer.targetPublicKey,
  }
}

const mapDispatch = {
  cancelAction: () => ({ type: Actions.transferModalDismissRequested }),
  mockSign: (id: string) => ({ type: Actions.fakeTransferSign, payload: id }),
  selectPublicKey: (id: string) => ({ type: Actions.setTransferTarget, payload: id })
};

export default connect(mapStateToProps, mapDispatch)(TransferModal);