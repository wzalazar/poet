import * as React from 'react';

import './Layout.scss';

import ProfileOverview from './ProfileOverview';
import { ProfileTabs } from './ProfileTabs';

export class ProfileLayout extends React.Component<any, undefined> {
  render() {
    return (
      <div className="profile row">
        <ProfileOverview id={this.props.id}/>
        <ProfileTabs id={this.props.id}/>
      </div>
    );
  }
}
