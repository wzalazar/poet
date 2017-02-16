import * as React from "react";
import { connect } from "react-redux";
import { Action } from "redux";

import Actions from '../actions';

interface LoginProps {
  logout: () => Action
}

class Component extends React.Component<LoginProps, undefined> {
  render() {
    return <a href="#" onClick={this.props.logout}>{this.props.children}</a>;
  }
}

export const LogoutButton = connect(() => ({}), {
  logout: () => ({ type: Actions.logoutButtonClicked })
})(Component);
