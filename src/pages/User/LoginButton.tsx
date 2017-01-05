import * as React from "react";
import { connect } from "react-redux";
import { Action } from "redux";

import * as constants from '../../constants';

interface LoginProps {
  login: () => Action
}

class Component extends React.Component<LoginProps, undefined> {
  render() {
    return <a className="button" href="#" onClick={this.props.login}>{this.props.children}</a>;
  }
}

export const LoginButton = connect(() => ({}), {
  login: () => ({ type: constants.userLoginResponse })
})(Component);
