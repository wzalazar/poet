import * as React from "react";
import { connect } from "react-redux";
import { Action } from "redux";

import Actions from '../actions/index';

interface LoginProps {
  login: () => Action
}

class Component extends React.Component<LoginProps, undefined> {
  render() {
    return <button className="login-button button-secondary" onClick={this.props.login}>{this.props.children}</button>;
  }
}

export const LoginButton = connect(() => ({}), {
  login: () => ({ type: Actions.loginButtonClicked })
})(Component);
