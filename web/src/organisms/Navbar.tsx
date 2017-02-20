import * as React from 'react';
import { Link } from 'react-router';
import { Action } from 'redux';
import { connect } from "react-redux";

import './Navbar.scss';

import Actions from '../actions/index';
import Constants from '../constants';
import { LoginButton } from "../components/LoginButton";
import { Images } from '../images/Images';

interface NavbarActions {
  dispatchSearchClick: () => Action;
  dispatchSearchChange: (searchQuery: string) => Action
}

export interface NavbarProps {
  readonly loggedIn?: boolean;
  readonly avatar?: string;
  readonly shadow?: boolean;
  readonly transparent?: boolean;
  readonly displayLogo?: boolean;
  readonly displaySearch?: boolean;
  readonly searchShadow?: boolean;
}

class NavbarComponent extends React.Component<NavbarProps & NavbarActions, undefined> {
  static defaultProps: NavbarProps = {
    shadow: true,
    transparent: false,
    displayLogo: true,
    displaySearch: true
  };

  render() {
    const navClasses = [
      'navbar',
      this.props.shadow && 'shadow',
      this.props.transparent && 'transparent'
    ];
    const searchClasses = [
      'search',
      this.props.searchShadow && 'shadow'
    ];
    return (
      <nav className={ navClasses.filterTruthy().join(' ') }>
        { this.props.displayLogo && <a className="navbar-brand" href="/"><img src={Images.Logo} /></a> }
        { this.props.displaySearch && <div className={ searchClasses.filterTruthy().join(' ') }  >
          <img src={Images.Glass} />
          <input
            type="text"
            placeholder="Search"
            onClick={this.props.dispatchSearchClick}
            onChange={(event: any) => this.props.dispatchSearchChange(event.target.value) }
          />
        </div> }
        <ul className="navbar-nav">
          { this.props.loggedIn ? this.loggedInActions() : this.notLoggedActions() }
        </ul>
      </nav>
    )
  }

  private renderNavLink(key: string, text: string): JSX.Element {
    return <li key={key} className="nav-item"><Link to={'/' + key} className="nav-link">{text}</Link></li>
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
      <li key='try-it-out'>
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
      <li key="create-work" className="nav-item"><Link to={'/create-work'} className="button-primary">New Work</Link></li>
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
  dispatchSearchClick: () => ({ type: Actions.navbarSearchClick }),
  dispatchSearchChange: (searchQuery: string) => ({ type: Actions.navbarSearchChange, searchQuery })
};

export const Navbar = connect(mapStateToProps, mapDispatch)(NavbarComponent);