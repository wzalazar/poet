/// <amd-dependency path="react-bootstrap-modal" />
declare var require: (moduleId: string) => any;

import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Action } from 'redux';

const { Modal } = require('react-overlays');

import Actions from '../actions';

import './Login.scss';

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
    textAlign: 'center',
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
      <div className="modal-login" style={dialogStyle()}>
        <h1>Login to Poet</h1>
        <div>
          <img onClick={props.dispatchLoginResponse}
               src="http://www.qr-code-generator.com/phpqrcode/getCode.php?cht=qr&chl=http%3A%2F%2Fwww.po.et&chs=180x180&choe=UTF-8&chld=L|0"/>
        </div>
        <div className="mb-2">Scan the QR code to login</div>
        <div className="onboard mb-2">
          <div className="placeholder-box" />
          <div className="ml-2">
            <div><Link to="http://www.po.et/" >Download</Link> the Poet: Authorizer App</div>
            <div className="text-muted">Average onboard takes &lt; 5 minutes</div>
          </div>
        </div>
        <div className="scan">
          <div className="placeholder-box" />
          <div className="ml-2">
            <div>Scan the QR code</div>
            <div className="text-muted">Login to the app &gt; scan QR code</div>
          </div>
        </div>
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