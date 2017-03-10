import * as React from 'react';
import { Link } from 'react-router';
const classNames = require('classnames');

import { LogoutButton } from "../components/LogoutButton";

import './AccountNavbar.scss'

interface AccountNavbarProps {
  location?: string;
}

export class AccountNavbar extends React.Component<AccountNavbarProps, undefined> {
  render() {
    return (
      <nav className="account-nav">
        <div className="container">
          <ul>
            { this.renderNavLink('account/notifications', 'Notifications') }
            { this.renderNavLink('account/wallet', 'Wallet') }
            { this.renderNavLink('account/profile', 'Profile') }
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

