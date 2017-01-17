/// <amd-dependency path="react-bootstrap-modal" />
declare var require: (moduleId: string) => any;

import * as React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';

const Modal = require('react-bootstrap-modal');

import Actions from '../actions';

interface LoginActions {
  dispatchLoginModalDisposeRequested: () => Action;
  dispatchLoginResponse: () => Action;
}

interface LoginProps {
  visible: boolean;
}

function render(props: LoginProps & LoginActions) {
  return (
    <Modal
      show={props.visible}
      onHide={props.dispatchLoginModalDisposeRequested}
      aria-labelledby="ModalHeader"
    >
      <h1>WACHIN</h1>
      <Modal.Header closeButton>
        <Modal.Title id='ModalHeader'>A Title Goes here</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Some Content here</p>
      </Modal.Body>
      <Modal.Footer>
        <Modal.Dismiss className='btn btn-default'>Cancel</Modal.Dismiss>

        <button className='btn btn-primary' onClick={props.dispatchLoginResponse}>
          Login
        </button>
      </Modal.Footer>
    </Modal>
  );
}

function mapStateToProps(state: any): LoginProps {
  return {
    visible: true
  }
}

const mapDispatch = {
  dispatchLoginModalDisposeRequested: () => ({ type: Actions.loginModalDisposeRequested }),
  dispatchLoginResponse: () => ({ type: Actions.loginResponse })
};

export default connect(mapStateToProps, mapDispatch)(render);