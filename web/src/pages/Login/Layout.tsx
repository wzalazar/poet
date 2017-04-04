import * as React from 'react';
import { Link } from 'react-router'
import { Action } from 'redux'
const QR = require('react-qr');

import { Images } from '../../images/Images';

import '../../extensions/String';

import './Layout.scss';

export interface LoginLayoutProps {
  readonly requestId: string;
}

export interface LoginLayoutState {

}

interface LoginActions {
  mockLoginRequest: (id: string) => Action;
  loginButtonClickedAction: () => Action;
}

export class LoginLayout extends React.Component<LoginLayoutProps & LoginActions, LoginLayoutState> {
  render() {
    return (
      <section className="page-login">
        <div className="top-row">
          <div><img src={Images.Logo} /></div>
          <h1>Login to Poet</h1>
        </div>
        <div className="middle-row">
          <section>
            <div className="qr">
              { this.props.requestId
                ? <a href="#" onClick={() => this.props.mockLoginRequest(this.props.requestId)}>
                  <QR text={ (this.props.requestId && this.props.requestId.padEnd(50)) || ''} />
                </a>
                : <img src={Images.Quill} className="loading" />
              }
            </div>
            <h2>Scan QR code to log in</h2>
            <div className="onboard">
              <div className="placeholder-box" >1</div>
              <div className="">
                <h3><Link to="http://www.po.et/" >Download</Link> the Poet: Authorizer App</h3>
                <small>Average onboard takes &lt; 5 min</small>
              </div>
            </div>
            <div className="scan">
              <div className="placeholder-box" >2</div>
              <div className="">
                <h3>Scan the QR code</h3>
                <small>Login to the app &gt; scan QR code</small>
              </div>
            </div>
          </section>
        </div>
        <div className="bottom-row"></div>

      </section>
    )
  }

  componentDidMount() {
    this.props.loginButtonClickedAction();
  }

}
