import * as React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { HexString } from '../../common';

import { ProfileNameWithLink } from '../../components/atoms/Profile';
import { SearchInput } from '../../components/atoms/SearchInput';
import { LicensesByProfile, LicenseToProfileRelationship } from '../../components/organisms/LicensesByProfile';
import { WorksByProfile, WorkToProfileRelationship } from '../../components/organisms/WorksByProfile';
import { PortfolioWorksFilters } from './PortfolioFilters';
import { LicensesFilters } from './LicensesFilters';

import './Tabs.scss';

export interface ProfileTabsProps {
  readonly id: HexString;
  readonly sessionPublicKey: string;
}

interface ProfileTabsState {
  readonly selectedWorksFilter?: string;
  readonly selectedLicensesFilter?: string;
  readonly searchQuery?: string;
}


export class ProfileTabs extends React.Component<ProfileTabsProps, ProfileTabsState> {

  constructor() {
    super(...arguments);
    this.state = {
      selectedWorksFilter: PortfolioWorksFilters.ALL,
      selectedLicensesFilter: LicensesFilters.ALL
    };
  }

  render() {
    return (
      <Tabs className="tabs col-sm-9" >
        <TabList className="tab-list tab-option-group extended" activeTabClassName="selected">
          <Tab>Works</Tab>
          <Tab>Licenses</Tab>
        </TabList>
        <TabPanel>
          <nav>
            <SearchInput
              className="search"
              value={this.state.searchQuery}
              onChange={searchQuery => this.setState({searchQuery})}
              placeholder="Search Works" />
            <PortfolioWorksFilters
              selectedId={this.state.selectedWorksFilter}
              onOptionSelected={selectedWorksFilter => this.setState({selectedWorksFilter})}
              className="filters"/>
          </nav>
          <WorksByProfile
            owner={this.props.id}
            transferRequested={() => null}
            relationship={this.selectedWorksFilterRelationship()}
            searchQuery={this.state.searchQuery}
            showActions={this.props.sessionPublicKey && this.props.sessionPublicKey === this.props.id}>
            <div className="no-results">
              <ProfileNameWithLink profileId={this.props.id}>This user&nbsp;</ProfileNameWithLink> hasn't registered any works yet.
            </div>
          </WorksByProfile>
        </TabPanel>
        <TabPanel>
          <nav>
            <SearchInput
              className="search"
              value={this.state.searchQuery}
              onChange={searchQuery => this.setState({searchQuery})}
              placeholder="Search Licenses" />
            <LicensesFilters
              selectedId={this.state.selectedWorksFilter}
              onOptionSelected={selectedWorksFilter => this.setState({selectedWorksFilter})}
              className="filters" />
          </nav>
          <LicensesByProfile
            publicKey={this.props.id}
            relationship={this.selectedLicensesFilterRelationship()}
            searchQuery={this.state.searchQuery}
            showActions={this.props.sessionPublicKey && this.props.sessionPublicKey === this.props.id}>
            <div className="no-results">
              <ProfileNameWithLink profileId={this.props.id} >This user&nbsp;</ProfileNameWithLink> doesn't own any licenses yet.
            </div>
          </LicensesByProfile>
        </TabPanel>
      </Tabs>
    )
  }

  private selectedWorksFilterRelationship(): WorkToProfileRelationship {
    switch (this.state.selectedWorksFilter) {
      case PortfolioWorksFilters.ALL:
        return 'relatedTo';
      case PortfolioWorksFilters.LICENSED_TO_ME:
        return 'licensedTo';
      case PortfolioWorksFilters.OWNED:
        return 'owner';
      case PortfolioWorksFilters.AUTHORED:
        return 'author';
    }
  }

  private selectedLicensesFilterRelationship(): LicenseToProfileRelationship {
    switch (this.state.selectedWorksFilter) {
      case LicensesFilters.ALL:
        return 'relatedTo';
      case LicensesFilters.SOLD:
        return 'emitter';
      case LicensesFilters.PURCHASED:
        return 'holder';
    }
  }

}