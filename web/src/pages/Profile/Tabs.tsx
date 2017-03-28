import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { Configuration } from '../../configuration';
import { HexString } from '../../common';

import { ProfileNameWithLink } from '../../components/atoms/Profile';
import { LicensesByProfile } from '../../components/organisms/LicensesByProfile';
import { WorksByProfile } from '../../components/organisms/WorksByProfile';

import './Tabs.scss';

export interface ProfileTabsProps {
  readonly id: HexString;
  readonly sessionPublicKey: string;
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
            query=""
            showActions={!!this.props.sessionPublicKey}>
            <div className="no-results">
              <ProfileNameWithLink profileId={this.props.id}>This user&nbsp;</ProfileNameWithLink> hasn't registered any works yet.
            </div>
          </WorksByProfile>
        </TabPanel>
        <TabPanel>
          <LicensesByProfile
            publicKey={this.props.id}
            relation="relatedTo"
            limit={Configuration.pagination.limit}
            showActions={!!this.props.sessionPublicKey}>
            <div className="no-results">
              <ProfileNameWithLink profileId={this.props.id} >This user&nbsp;</ProfileNameWithLink> doesn't own any licenses yet.
            </div>
          </LicensesByProfile>
        </TabPanel>
      </Tabs>
    )
  }

}