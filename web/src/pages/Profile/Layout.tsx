import * as React from 'react';

import './Layout.scss';

import { Overview } from './Overview';
import { ProfileTabs } from './Tabs';

export class ProfileLayout extends React.Component<any, undefined> {
  render() {
    return (
      <section className="container">
        <div className="page-profile row">
          <Overview id={this.props.id}/>
          <ProfileTabs id={this.props.id}/>
        </div>
      </section>
    );
  }
}
