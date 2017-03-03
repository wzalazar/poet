import * as React from 'react';
import { Link } from 'react-router';
const classNames = require('classnames');

import { LogoutButton } from "../components/LogoutButton";

import './UserNavbar.scss'

interface UserNavbarProps {
  location?: string;
}

export class UserNavbar extends React.Component<UserNavbarProps, undefined> {
  render() {
    return (
      <nav className="user-nav">
        <div className="container">
          <ul>
            { this.renderNavLink('account/settings', 'Settings') }
            { this.renderNavLink('account/wallet', 'Wallet') }
            { this.renderNavLink('account/notifications', 'Notifications') }
            <li key="logout" className="logout"><LogoutButton>LOGOUT</LogoutButton></li>
          </ul>
        </div>
      </nav>
    )
  }

  private renderNavLink(key: string, text: string): JSX.Element {
    return (
      <li key={key}
          className={ classNames({'selected': this.props.location === '/' + key}) }>
        <Link to={'/' + key}>{text}</Link>
      </li>
    )
  }

}

