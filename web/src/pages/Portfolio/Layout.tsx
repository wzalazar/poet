import * as React from 'react';

import { DispatchesTransferRequested } from '../../actions/requests';
import { SelectProfileById } from '../../atoms/Arguments';
import { OwnedWorks } from './Works';
import { PortfolioWorksFilters } from './Filters';

import './Layout.scss';
import { SearchInput } from '../../atoms/SearchInput';

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
          />
        </main>
      </section>
    )
  }
}
