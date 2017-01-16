import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import './Layout.scss';

import ProfileWorks from './ProfileWorks';


export class ProfileLayout extends React.Component<undefined, undefined> {
  render() {
    return (
      <div className="profile">
        <Tabs>
          <TabList>
            <Tab>Works</Tab>
            <Tab>Licenses</Tab>
          </TabList>
          <TabPanel>
            <ProfileWorks author="1"/>
          </TabPanel>
          <TabPanel>
            <h2>Licenses go here</h2>
          </TabPanel>
        </Tabs>


      </div>
    )
  }
}
