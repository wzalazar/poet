import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import '../../extensions/Array'

import { HexString } from '../../common';

import ContentTab from './ContentTab';
import HistoryTab from './HistoryTab';
import TechnicalTab from './TechnicalTab';

interface WorkTabProps {
  id: HexString;
}

export class WorkTabs extends React.Component<WorkTabProps, undefined> {
  render() {
    const workId = this.props.id;
    return (
      <Tabs selectedIndex={0} className="work-tabs" >
        <TabList className="tab-option-group">
          <Tab>Content</Tab>
          <Tab>History</Tab>
          <Tab>Technical</Tab>
        </TabList>
        <TabPanel>
          <ContentTab id={workId} />
        </TabPanel>
        <TabPanel>
          <HistoryTab id={workId} />
        </TabPanel>
        <TabPanel>
          <TechnicalTab id={workId} />
        </TabPanel>
      </Tabs>
    )
  }
}
