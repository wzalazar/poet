import * as React from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'react-tabs';

import Constants from '../constants';
import { Navbar } from "../organisms/Navbar";
import { AccountNavbar } from "../organisms/AccountNavbar";
import { Footer } from '../organisms/Footer';
import Modals from '../modals';

import 'react-datepicker/dist/react-datepicker.css';

import './RootLayout.scss'

Tabs.setUseDefaultStyles(false);

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
  const accountUrls = ['/account/profile', '/account/wallet', '/account/notifications'];
  const worksUrl = '/works';

  const navbarShadow = ![worksUrl, '/'].includes(props.location.pathname);
  const navbarTransparent = ['/'].includes(props.location.pathname) && props.loggedIn;
  const navbarMargin = ![worksUrl, ...accountUrls].includes(props.location.pathname);
  const displayNavbarLogo = !['/'].includes(props.location.pathname) || !props.loggedIn;
  const displayNavbarSearch = !['/'].includes(props.location.pathname) || !props.loggedIn;
  const displayUserNavbar = accountUrls.includes(props.location.pathname);
  const searchShadow = [worksUrl].includes(props.location.pathname);

  return (
    <div className="root-layout">
      { modals }
      <Navbar
        shadow={navbarShadow}
        displayLogo={displayNavbarLogo}
        displaySearch={displayNavbarSearch}
        transparent={navbarTransparent}
        searchShadow={searchShadow}
        margin={navbarMargin}
      />
      { displayUserNavbar && <AccountNavbar location={props.location.pathname}/> }
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