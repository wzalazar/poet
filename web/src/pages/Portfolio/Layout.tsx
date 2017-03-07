import * as React from 'react';

import { DispatchesTransferRequested } from '../../actions/requests';
import { SelectProfileById } from '../../atoms/Arguments';
import { SearchInput } from '../../atoms/SearchInput';
import { OwnedWorks, WorkToProfileRelationship } from './Works';
import { PortfolioWorksFilters } from './Filters';

import './Layout.scss';

interface PortfolioLayoutState {
  readonly selectedFilter?: string;
  readonly searchQuery?: string;
}

export class PortfolioLayout extends React.Component<SelectProfileById & DispatchesTransferRequested, PortfolioLayoutState> {

  constructor() {
    super(...arguments);
    this.state = {
      selectedFilter: PortfolioWorksFilters.OWNED
    }
  }

  render() {
    return (
      <section className="container page-portfolio">
        <header>
          <h1>Portfolio</h1>
          <SearchInput
            className="search"
            value={this.state.searchQuery}
            onChange={searchQuery => this.setState({searchQuery})}
            placeholder="Search Portfolio" />
        </header>
        <main>
          <PortfolioWorksFilters
            selectedId={this.state.selectedFilter}
            onOptionSelected={selectedFilter => this.setState({selectedFilter})}/>
          <OwnedWorks
            owner={this.props.profileId}
            transferRequested={this.props.transferRequested}
            relationship={this.selectedFilterRelationship()}
            query={this.state.searchQuery}
            showActions
          />
        </main>
      </section>
    )
  }

  private selectedFilterRelationship(): WorkToProfileRelationship {
    switch (this.state.selectedFilter) {
      case PortfolioWorksFilters.ALL:
        return 'relatedTo';
      case PortfolioWorksFilters.OWNED:
        return 'owner';
      case PortfolioWorksFilters.AUTHORED:
        return 'author';
    }
  }
}
