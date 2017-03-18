import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import '../../extensions/Array'

import { HexString } from '../../common';

import ContentTab from './Tabs/ContentTab';
import HistoryTab from './Tabs/HistoryTab';
import TechnicalTab from './Tabs/TechnicalTab';

interface WorkTabProps {
  id: HexString;
}

export class WorkTabs extends React.Component<WorkTabProps, undefined> {
  render() {
    return (
      <Tabs selectedIndex={0} className="work-tabs" >
        <TabList className="tab-list-one" activeTabClassName="selected">
          <Tab>Content</Tab>
          <Tab>History</Tab>
          <Tab>Technical</Tab>
        </TabList>
        <TabPanel>
          <ContentTab id={this.props.id} />
        </TabPanel>
        <TabPanel>
          <HistoryTab id={this.props.id} />
        </TabPanel>
        <TabPanel>
          <TechnicalTab id={this.props.id} />
        </TabPanel>
      </Tabs>
    )
  }
}
