import * as React from 'react';
import {Navbar} from "../organisms/Navbar";

interface ChildrenProps {
  children: any;
}

import './RootLayout.scss'

export function Layout(props: ChildrenProps) {
  return (<div className="root-layout">
    <Navbar />
    { props.children }
  </div>);
}