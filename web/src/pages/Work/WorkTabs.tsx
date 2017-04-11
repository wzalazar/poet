import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import '../../extensions/Array'

import { HexString } from '../../common';

import { ContentTab } from './Tabs/ContentTab';
import HistoryTab from './Tabs/HistoryTab';
import TechnicalTab from './Tabs/TechnicalTab';

interface WorkTabProps {
  readonly id: HexString;
}

export const WorkTabs = (props: WorkTabProps) => (
  <Tabs selectedIndex={0} className="work-tabs" >
    <TabList className="tab-list-one" activeTabClassName="selected">
      <Tab>Content</Tab>
      <Tab>History</Tab>
      <Tab>Technical</Tab>
    </TabList>
    <TabPanel>
      <ContentTab workId={props.id} />
    </TabPanel>
    <TabPanel>
      <HistoryTab id={props.id} />
    </TabPanel>
    <TabPanel>
      <TechnicalTab id={props.id} />
    </TabPanel>
  </Tabs>
);