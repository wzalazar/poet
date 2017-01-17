import * as React from 'react';
import { Link } from 'react-router';
import { Action } from 'redux';
import { connect } from "react-redux";

import './Navbar.scss'

import Actions from '../actions';
import { LoginButton } from "../components/LoginButton";

interface NavbarActions {
  dispatchSearchClick: () => Action;
}

export interface NavbarProps {
  loggedIn: boolean;
}

class NavbarComponent extends React.Component<NavbarProps & NavbarActions, undefined> {
  render() {
    return (
      <nav className="navbar">
        <a className="navbar-brand" href="/">Poet</a>
        <div className="search" >
          <input type="text" placeholder="Search Creative Works" onClick={this.props.dispatchSearchClick} />
        </div>
        <ul className="navbar-nav">
          { this.notLoggedActions() }
          { this.loggedInActions() }
        </ul>
      </nav>
    )
  }

  private renderNavLink(key: string, text: string): JSX.Element {
    return <li key={key} className="nav-item"><Link to={'/' + key} className="nav-link">{text}</Link></li>
  }

  private renderNavButton(key: string, text: string): JSX.Element {
    return <li key={key} className="nav-item"><a href="#" className="btn btn-primary btn-sm">{text}</a></li>;
  }

  private notLoggedActions(): JSX.Element[] {
    if (this.props.loggedIn) {
      return [];
    }
    return [
      this.renderNavLink('about', 'About'),
      this.renderNavLink('documentation', 'Documentation'),
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

function mapStateToProps(state: any): NavbarProps {
  return {
    loggedIn: state.currentUser && state.currentUser.loggedIn
  }
}

const mapDispatch = {
  dispatchSearchClick: () => ({ type: Actions.navbarSearchClick })
};

export const Navbar = connect(mapStateToProps, mapDispatch)(NavbarComponent);