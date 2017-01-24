import * as React from 'react';
import { Link } from 'react-router';

//import './UserNavbar.scss'

export class UserNavbar extends React.Component<undefined, undefined> {
  render() {
    return (
      <nav className="navbar">
        <ul className="navbar-nav">
          { this.renderNavLink('user/profile', 'Profile') }
          { this.renderNavLink('user/wallet', 'Wallet') }
        </ul>
      </nav>
    )
  }

  private renderNavLink(key: string, text: string): JSX.Element {
    return <li key={key} className="nav-item"><Link to={'/' + key} className="nav-link">{text}</Link></li>
  }

}

