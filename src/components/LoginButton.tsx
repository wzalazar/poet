import * as React from "react";
import { connect } from "react-redux";
import { Action } from "redux";

import Actions from '../actions';

interface LoginProps {
  login: () => Action
}

class Component extends React.Component<LoginProps, undefined> {
  render() {
    return <a className="btn btn-outline-primary btn-sm" href="#" onClick={this.props.login}>{this.props.children}</a>;
  }
}

export const LoginButton = connect(() => ({}), {
  login: () => ({ type: Actions.loginResponse })
})(Component);
