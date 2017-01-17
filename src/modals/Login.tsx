/// <amd-dependency path="react-bootstrap-modal" />
declare var require: (moduleId: string) => any;

import * as React from 'react';
import { connect } from 'react-redux';
import { Action } from 'redux';

const { Modal } = require('react-overlays');

import Actions from '../actions';

interface LoginActions {
  dispatchLoginModalDisposeRequested: () => Action;
  dispatchLoginResponse: () => Action;
}

interface LoginProps {
  visible: boolean;
}

const modalStyle = {
  position: 'fixed',
  zIndex: 1040,
  top: 0, bottom: 0, left: 0, right: 0
};

const backdropStyle = {
  ...modalStyle,
  zIndex: 'auto',
  backgroundColor: '#000',
  opacity: 0.5
};

const dialogStyle = () => {
  const left = 50;
  const top = 50;
  return {
    position: 'absolute',
    width: 400,
    top: top + '%', left: left + '%',
    transform: `translate(-${top}%, -${left}%)`,
    border: '1px solid #e5e5e5',
    backgroundColor: 'white',
    boxShadow: '0 5px 15px rgba(0,0,0,.5)',
    padding: 20
  }
};

function render(props: LoginProps & LoginActions) {
  return (
    <Modal
      aria-labelledby='modal-label'
      style={modalStyle}
      backdropStyle={backdropStyle}
      show={props.visible}
      onHide={props.dispatchLoginModalDisposeRequested}
    >
      <div style={dialogStyle()}>
        <h1>Test</h1>
        <button className='btn btn-default' onClick={props.dispatchLoginResponse}>Login</button>
      </div>
    </Modal>
  );
}

function mapStateToProps(state: any): LoginProps {
  return {
    visible: state.modals.login
  }
}

const mapDispatch = {
  dispatchLoginModalDisposeRequested: () => ({ type: Actions.loginModalDisposeRequested }),
  dispatchLoginResponse: () => ({ type: Actions.loginResponse })
};

export default connect(mapStateToProps, mapDispatch)(render);