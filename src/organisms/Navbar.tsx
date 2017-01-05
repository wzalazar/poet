import * as React from 'react';
import {connect} from "react-redux";

import './Navbar.scss'
import {LoginButton} from "../pages/User/LoginButton";
import {UserState} from "../pages/User/Loader";

class Component extends React.Component<UserState, undefined> {
  render() {
    return <div className="navbar">
      <h1>Poet</h1>
      <ul>
        { this.notLoggedActions() }
        { this.loggedInActions() }
        <li>Register Work</li>
      </ul>
    </div>
  }

  private notLoggedActions(): JSX.Element[] {
    if (this.props.loggedIn) {
      return [];
    }
    return [
      <li key="about">About</li>,
      <li key="docs">Documentation</li>,
      <li key="login"><LoginButton>Login</LoginButton></li>
    ];
  }

  private loggedInActions(): JSX.Element[] {
    if (!this.props.loggedIn) {
      return [];
    }
    return [
      <li key="licenses">My Licenses</li>,
      <li key="notifs">Notifications</li>,
    ];
  }
}

export const Navbar = connect((state: any) => state.currentUser)(Component);