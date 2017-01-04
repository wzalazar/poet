import * as React from 'react';

import './Navbar.scss'

export class Navbar extends React.Component<undefined, undefined> {
  render() {
    return <div className="navbar">
      <h1>Poet</h1>
      <ul>
        <li>About</li>
        <li>Documentation</li>
        <li>Login</li>
        <li>Register Work</li>
      </ul>
    </div>
  }
}