import * as React from 'react';
import { Navbar } from "../organisms/Navbar";
import Modals from '../modals';

interface ChildrenProps {
  children: any;
}

import './RootLayout.scss'

const modals = Modals.map((Modal, index) => <Modal key={index}/>);

export function Layout(props: ChildrenProps) {
  return (
    <div className="root-layout">
      { modals }
      <Navbar />
      { props.children }
    </div>
  );
}