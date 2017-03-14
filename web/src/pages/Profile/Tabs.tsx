import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Configuration } from '../../configuration';
import { HexString } from '../../common';

import { LicensesByProfile } from '../../organisms/LicensesByProfile';
import { WorksByProfile } from '../../organisms/WorksByProfile';

import './Tabs.scss';

export interface ProfileTabsProps {
  id: HexString;
}

export class ProfileTabs extends React.Component<ProfileTabsProps, any> {

  render() {
    return (
      <Tabs className="tabs col-sm-9" >
        <TabList className="tab-list tab-option-group extended" activeTabClassName="selected">
          <Tab>Works</Tab>
          <Tab>Licenses</Tab>
        </TabList>
        <TabPanel>
          <WorksByProfile
            owner={this.props.id}
            transferRequested={() => null}
            relationship="author"
            query="" />
        </TabPanel>
        <TabPanel>
          <LicensesByProfile
            publicKey={this.props.id}
            relation="relatedTo"
            limit={Configuration.pagination.limit} />
        </TabPanel>
      </Tabs>
    )
  }

}