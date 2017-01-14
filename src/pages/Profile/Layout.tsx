import * as React from 'react';

import './Layout.scss';

import ProfileWorks from './ProfileWorks';

export class ProfileLayout extends React.Component<undefined, undefined> {
  render() {
    return (
      <div className="profile">
        <ProfileWorks author="1" />
      </div>
    )
  }
}
