import * as React from 'react';
import { Navbar } from "../organisms/Navbar";
import { UserNavbar } from "../organisms/UserNavbar";
import Modals from '../modals';

import './RootLayout.scss'

const modals = Modals.map((Modal, index) => <Modal key={index}/>);

const userPaths = ['/account/settings', '/account/wallet'];

export function Layout(props: any) {
  return (
    <div className="root-layout">
      { modals }
      <div >
        <Navbar shadow={!['/works'].includes(props.location.pathname)} /> {/*TODO: super mega hacky approach*/}
        { userPaths.includes(props.location.pathname) && <UserNavbar location={props.location.pathname}/> }
      </div>
      <div>
        { props.children }
      </div>
    </div>
  );
}