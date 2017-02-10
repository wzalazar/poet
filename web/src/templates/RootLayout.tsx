import * as React from 'react';

import { Navbar } from "../organisms/Navbar";
import { UserNavbar } from "../organisms/UserNavbar";
import { Footer } from '../organisms/Footer';
import Modals from '../modals';

import './RootLayout.scss'

const modals = Modals.map((Modal, index) => <Modal key={index}/>);

const userPaths = ['/account/settings', '/account/wallet'];

export function Layout(props: any) {
  // TODO: a way for pages to provide these so the RootLayout doesn't need to know what urls are mapped to what pages
  const navbarShadow = !['/works', '/'].includes(props.location.pathname);
  const navbarTransparent = ['/'].includes(props.location.pathname);
  const displayNavbarLogo = !['/'].includes(props.location.pathname);
  const displayNavbarSearch = !['/'].includes(props.location.pathname);

  return (
    <div className="root-layout">
      { modals }
      <Navbar shadow={navbarShadow} displayLogo={displayNavbarLogo} displaySearch={displayNavbarSearch} transparent={navbarTransparent} />
      { userPaths.includes(props.location.pathname) && <UserNavbar location={props.location.pathname}/> }
      { props.children }
      <Footer/>
    </div>
  );
}