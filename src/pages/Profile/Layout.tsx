import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import './Layout.scss';

import ProfileWorks from './ProfileWorks';
import ProfileOverview from './ProfileOverview';

export class ProfileLayout extends React.Component<undefined, undefined> {
  render() {
    return (
      <div className="profile row">
        <ProfileOverview id="1" />
        <div className="col-sm-9">
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
      </div>
    );
  }
}
