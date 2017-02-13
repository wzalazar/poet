import * as React from 'react';
import { connect } from 'react-redux';

import Constants from '../constants';
import { Navbar } from "../organisms/Navbar";
import { UserNavbar } from "../organisms/UserNavbar";
import { Footer } from '../organisms/Footer';
import Modals from '../modals';

import './RootLayout.scss'

const modals = Modals.map((Modal, index) => <Modal key={index}/>);

interface RootLayoutProps {
  readonly loggedIn?: boolean;
  readonly location?: {
    readonly pathname: string;
  }
  readonly children?: any;
}

function render(props: RootLayoutProps) {
  // TODO: a way for pages to provide these so the RootLayout doesn't need to know what urls are mapped to what pages
  const navbarShadow = !['/works', '/'].includes(props.location.pathname) || !props.loggedIn;
  const navbarTransparent = ['/'].includes(props.location.pathname) && props.loggedIn;
  const displayNavbarLogo = !['/'].includes(props.location.pathname) || !props.loggedIn;
  const displayNavbarSearch = !['/'].includes(props.location.pathname) || !props.loggedIn;
  const displayUserNavbar = ['/account/settings', '/account/wallet'].includes(props.location.pathname);

  return (
    <div className="root-layout">
      { modals }
      <Navbar
        shadow={navbarShadow}
        displayLogo={displayNavbarLogo}
        displaySearch={displayNavbarSearch}
        transparent={navbarTransparent}
      />
      { displayUserNavbar && <UserNavbar location={props.location.pathname}/> }
      { props.children }
      <Footer/>
    </div>
  );
}

function mapStateToProps(state: any): RootLayoutProps {
  return {
    loggedIn: state.session.state === Constants.LOGGED_IN
  }
}

export const Layout = connect(mapStateToProps)(render);