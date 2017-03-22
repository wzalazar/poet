import * as React from 'react';
import { Link } from 'react-router';

import { Images } from '../../images/Images';
import { Work } from '../../Interfaces';
import { UrlObject } from '../../common';
import { DispatchesTransferRequested } from '../../actions/requests';
import { HEADER_X_TOTAL_COUNT, PoetAPIResourceProvider } from '../../components/atoms/base/PoetApiResource';
import { SelectProfileById } from '../../components/atoms/Arguments';
import { SearchInput } from '../../components/atoms/SearchInput';
import { WorksByProfile, WorkToProfileRelationship } from '../../components/organisms/WorksByProfile';
import { PortfolioWorksFilters } from './Filters';

import './Layout.scss';

interface PortfolioLayoutState {
  readonly selectedFilter?: string;
  readonly searchQuery?: string;
}

export class PortfolioLayout extends PoetAPIResourceProvider<Work[], SelectProfileById & DispatchesTransferRequested, PortfolioLayoutState> {

  constructor() {
    super(...arguments);
    this.state = {
      selectedFilter: PortfolioWorksFilters.ALL
    }
  }

  poetURL(): UrlObject {
    return {
      url: `/works`,
      query: {
        relatedTo: this.props.profileId,
        limit: 1,
      }
    }
  }

  renderElement(works: Work[], headers: Headers) {
    const count =  headers.get(HEADER_X_TOTAL_COUNT) && parseInt(headers.get(HEADER_X_TOTAL_COUNT));

    if (!count)
      return this.renderNoWorks();

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
          <WorksByProfile
            owner={this.props.profileId}
            transferRequested={this.props.transferRequested}
            relationship={this.selectedFilterRelationship()}
            query={this.state.searchQuery}
            showActions={this.state.selectedFilter === PortfolioWorksFilters.OWNED}
          />
        </main>
      </section>
    )
  }

  renderLoading() {
    return (
      <section className="container page-portfolio loading">
        <header>
          <h1>Portfolio</h1>
        </header>
        <main>
          <img src={Images.Quill} />
        </main>
      </section>
    )
  }

  private renderNoWorks() {
    return (
      <section className="container page-portfolio no-works">
        <header>
          <h1>Portfolio</h1>
        </header>
        <main>
          <div className="circle"></div>
          <div className="message">
            <h1>You haven’t Registered any Creative Works Yet</h1>
            <small>This takes you through the process of registereing a new work. If you would like to automate this process please view our integrations.</small>
          </div>
          <Link to="/create-work" className="button-primary"><img src={Images.QuillInverted} />Register New Work</Link>
        </main>
      </section>
    )
  }

  private selectedFilterRelationship(): WorkToProfileRelationship {
    switch (this.state.selectedFilter) {
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
}
