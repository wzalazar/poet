import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Configuration } from '../../config';
import { HexString } from '../../common';

import ProfileWorks from './ProfileWorks';
import { Licenses } from '../Licenses/Licenses';

export interface ProfileTabsProps {
  id: HexString;
}

export class ProfileTabs extends React.Component<ProfileTabsProps, any> {
  render() {
    return (
      <div className="col-sm-9">
        <Tabs>
          <TabList>
            <Tab>Works</Tab>
            <Tab>Licenses</Tab>
          </TabList>
          <TabPanel>
            <ProfileWorks author={this.props.id}/>
          </TabPanel>
          <TabPanel>
            <Licenses publicKey={this.props.id} showActions={false} relation="emitter" limit={Configuration.pagination.limit} />
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}