import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { HexString } from '../../common';
import { WorksTab } from './Works';
import { Licenses } from './Licenses';

import './Tabs.scss';

export interface ProfileTabsProps {
  readonly id: HexString;
  readonly sessionPublicKey: string;
}

export class ProfileTabs extends React.Component<ProfileTabsProps, undefined> {

  render() {
    return (
      <Tabs className="tabs col-sm-9" >
        <TabList className="tab-list tab-option-group extended" activeTabClassName="selected">
          <Tab>Works</Tab>
          <Tab>Licenses</Tab>
        </TabList>
        <TabPanel>
          <WorksTab
            profileId={this.props.id}
            authenticatedUserIsOwner={this.props.sessionPublicKey && this.props.sessionPublicKey === this.props.id}
            transferRequested={null}
          />
        </TabPanel>
        <TabPanel>
          <Licenses
            profileId={this.props.id}
            authenticatedUserIsOwner={this.props.sessionPublicKey && this.props.sessionPublicKey === this.props.id}
          />
        </TabPanel>
      </Tabs>
    )
  }

}