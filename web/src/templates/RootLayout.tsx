import * as React from 'react';

import { Navbar } from "../organisms/Navbar";
import { UserNavbar } from "../organisms/UserNavbar";
import { Footer } from '../organisms/Footer';
import Modals from '../modals';

import './RootLayout.scss'

const modals = Modals.map((Modal, index) => <Modal key={index}/>);

const userPaths = ['/account/settings', '/account/wallet'];

export function Layout(props: any) {
  const navbarShadow = !['/works'].includes(props.location.pathname); // TODO: super mega hacky approach
  return (
    <div className="root-layout">
      { modals }
      <Navbar shadow={navbarShadow} />
      { userPaths.includes(props.location.pathname) && <UserNavbar location={props.location.pathname}/> }
      { props.children }
      <Footer/>
    </div>
  );
}