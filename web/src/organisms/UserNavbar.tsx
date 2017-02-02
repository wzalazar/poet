import * as React from 'react';
import { Link } from 'react-router';

import './UserNavbar.scss'

interface UserNavbarProps {
  location?: string;
}

export class UserNavbar extends React.Component<UserNavbarProps, undefined> {
  render() {
    return (
      <nav className="user-nav">
        <ul>
          { this.renderNavLink('user/profile', 'Settings') }
          { this.renderNavLink('user/wallet', 'Wallet') }
        </ul>
      </nav>
    )
  }

  private renderNavLink(key: string, text: string): JSX.Element {
    return <li key={key} className={ this.props.location === '/' + key && 'selected' }><Link to={'/' + key}>{text}</Link></li>
  }

}

