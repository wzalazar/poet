import * as React from 'react';

import './Layout.scss';

import { LandingLoggedOut } from './LandingLoggedOut';
import { LandingLoggedIn } from './LandingLoggedIn';
import { Actions } from '../../actions/index';

export interface LandingProps {
  loggedIn: boolean;
  dispatchSearch: () => any;
  dispatchSearchChange: (searchQuery: string) => any;
}

export class LandingLayout extends React.Component<LandingProps, undefined> {
  render() {
    return (
      <div className="landing">
        { this.props.loggedIn ? <LandingLoggedIn dispatchSearchChange={this.props.dispatchSearchChange} dispatchSearch={this.props.dispatchSearch} /> : <LandingLoggedOut /> }
      </div>
    )
  }
}
