import * as React from 'react';

import './Layout.scss';

import ProfileOverview from './ProfileOverview';
import { ProfileTabs } from './ProfileTabs';

export class ProfileLayout extends React.Component<undefined, undefined> {
  render() {
    const authorId = '1';
    return (
      <div className="profile row">
        <ProfileOverview id={authorId}/>
        <ProfileTabs id={authorId}/>
      </div>
    );
  }
}
