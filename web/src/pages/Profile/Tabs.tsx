import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Configuration } from '../../config';
import { HexString } from '../../common';

import { Licenses } from '../Licenses/Licenses';
import { OwnedWorks } from '../Portfolio/Works';

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
          <OwnedWorks
            owner={this.props.id}
            transferRequested={() => null}
            relationship="author"
            query="" />
        </TabPanel>
        <TabPanel>
          <Licenses
            publicKey={this.props.id}
            relation="relatedTo"
            limit={Configuration.pagination.limit} />
        </TabPanel>
      </Tabs>
    )
  }

}