import * as React from 'react';

import './Layout.scss';

import { LandingLoggedOut } from './LandingLoggedOut';
import { LandingLoggedIn } from './LandingLoggedIn';

export interface LandingProps {
  loggedIn: boolean;
}

export class LandingLayout extends React.Component<LandingProps, undefined> {
  render() {
    return (
      <div className="container landing">
        { this.props.loggedIn ? <LandingLoggedIn /> : <LandingLoggedOut /> }
      </div>
    )
  }
}
