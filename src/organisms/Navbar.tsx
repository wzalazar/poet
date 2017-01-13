import * as React from 'react';
import {connect} from "react-redux";

import './Navbar.scss'
import {LoginButton} from "../pages/User/LoginButton";
import {UserState} from "../pages/User/Loader";

class Component extends React.Component<UserState, undefined> {
  render() {
    return <nav className="navbar">
      <h1>Poet</h1>
      <div className="search"><input type="text" placeholder="Search Creative Works"/></div>
      <ul className="nav">
        { this.notLoggedActions() }
        { this.loggedInActions() }
      </ul>
    </nav>
  }

  renderNavLink(key: string, text: string): JSX.Element {
    return <li key={key} className="nav-item" ><a href="#" className="nav-link" >{text}</a></li>
  }

  renderNavButton(key: string, text: string): JSX.Element {
    return <li key={key} className="nav-item"><a href="#" className="btn btn-primary btn-sm">{text}</a></li>;
  }

  private notLoggedActions(): JSX.Element[] {
    if (this.props.loggedIn) {
      return [];
    }
    return [
      this.renderNavLink('about', 'About'),
      this.renderNavLink('documentation', 'Documentation'),
      this.renderNavButton('documentation', 'Documentation'),
      <li key="login"><LoginButton>Login</LoginButton></li>,
      this.renderNavButton('try-it-out', 'Try it Out')
    ];
  }

  private loggedInActions(): JSX.Element[] {
    if (!this.props.loggedIn) {
      return [];
    }
    return [
      this.renderNavLink('portfolio', 'Portfolio'),
      this.renderNavLink('licenses', 'Licenses'),
      this.renderNavLink('user', 'User'),
      this.renderNavButton('new-work', 'New Work')
    ];
  }
}

export const Navbar = connect((state: any) => state.currentUser)(Component);