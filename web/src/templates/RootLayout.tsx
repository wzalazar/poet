import * as React from 'react';
import { Navbar } from "../organisms/Navbar";
import { UserNavbar } from "../organisms/UserNavbar";
import Modals from '../modals';

import './RootLayout.scss'

const modals = Modals.map((Modal, index) => <Modal key={index}/>);

const userPaths = ['/user/profile', '/user/wallet'];

export function Layout(props: any) {
  return (
    <div className="root-layout">
      { modals }
      <Navbar />
      { userPaths.includes(props.location.pathname) && <UserNavbar location={props.location.pathname}/> }
      { props.children }
    </div>
  );
}