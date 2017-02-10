import * as React from 'react';
import { Link } from 'react-router';
import { Action } from 'redux';
import { connect } from "react-redux";

import './Navbar.scss'

import Actions from '../actions';
import Constants from '../constants';
import { LoginButton } from "../components/LoginButton";
import { LogoutButton } from "../components/LogoutButton";
import { Images } from '../images/Images';

interface NavbarActions {
  dispatchSearchClick: () => Action;
}

export interface NavbarProps {
  readonly loggedIn?: boolean;
  readonly avatar?: string;
  readonly shadow: boolean;
}

class NavbarComponent extends React.Component<NavbarProps & NavbarActions, undefined> {
  render() {
    return (
      <nav className={'navbar ' + (this.props.shadow ? 'shadow' : '') }>
        <a className="navbar-brand" href="/"><img src={Images.Logo} /></a>
        <div className="search" >
          <img src={Images.Glass} /><input type="text" placeholder="Search" onClick={this.props.dispatchSearchClick} />
        </div>
        <ul className="navbar-nav">
          { this.props.loggedIn ? this.loggedInActions() : this.notLoggedActions() }
        </ul>
      </nav>
    )
  }

  private renderNavLink(key: string, text: string): JSX.Element {
    return <li key={key} className="nav-item"><Link to={'/' + key} className="nav-link">{text}</Link></li>
  }

  private renderNavButton(key: string, text: string): JSX.Element {
    return <li key={key} className="nav-item"><Link to={'/' + key} className="btn btn-primary btn-sm">{text}</Link></li>;
  }

  private renderAvatar() {
    return (
      <Link to={'/account/settings'} className="nav-link">
        <img key="avatar" src={this.props.avatar} className="rounded-circle" />
      </Link>
   );
  }

  private notLoggedActions(): JSX.Element[] {
    return [
      this.renderNavLink('about', 'About'),
      this.renderNavLink('documentation', 'Documentation'),
      <li key="login"><LoginButton>Login</LoginButton></li>,
      <li key='try-it-out' className='try-it-out'>
        <Link to={'/try-it-out'} className="try-it-out">
          <img src={Images.Quill} /><span>Try It Out</span>
        </Link>
      </li>
    ];
  }

  private loggedInActions(): JSX.Element[] {
    return [
      this.renderNavLink('portfolio', 'Portfolio'),
      this.renderNavLink('licenses', 'Licenses'),
      <li key="avatar" className="nav-item avatar">{ this.renderAvatar() }</li>,
      <li key="logout"><LogoutButton>Logout</LogoutButton></li>,
      this.renderNavButton('create-work', 'New Work')
    ];
  }
}

function mapStateToProps(state: any, ownProps: NavbarProps): NavbarProps {
  return {
    ...ownProps,
    loggedIn: state.session && (state.session.state === Constants.LOGGED_IN),
    avatar: state.profile && state.profile.attributes && state.profile.attributes.imageData
  }
}

const mapDispatch = {
  dispatchSearchClick: () => ({ type: Actions.navbarSearchClick })
};

export const Navbar = connect(mapStateToProps, mapDispatch)(NavbarComponent);