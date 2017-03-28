import * as React from 'react';
import { Link } from 'react-router';

import { Images } from '../../images/Images';
import { HexString } from '../../common';
import { Configuration } from '../../configuration';
import { SearchInput } from '../../components/atoms/SearchInput';
import {
  LicensesByProfile, LicensesResource,
  LicenseToProfileRelationship
} from '../../components/organisms/LicensesByProfile'
import { HEADER_X_TOTAL_COUNT, PoetAPIResourceProvider } from '../../components/atoms/base/PoetApiResource';
import { LicensesFilters } from '../Profile/LicensesFilters';

import './Layout.scss';

interface LicensesProps {
  publicKey: HexString;
}

interface LicensesLayoutState {
  readonly selectedFilter?: string;
  readonly searchQuery?: string;
}

export class LicensesLayout extends PoetAPIResourceProvider<LicensesResource, LicensesProps, LicensesLayoutState> {

  constructor() {
    super(...arguments);
    this.state = {
      selectedFilter: LicensesFilters.ALL,
      searchQuery: ''
    }
  }

  poetURL() {
    return {
      url: `/licenses`,
      query: {
        limit: 1,
        relatedTo: this.props.publicKey
      }
    }
  }

  renderElement(licenses: LicensesResource, headers: Headers) {
    const count = headers.get(HEADER_X_TOTAL_COUNT) && parseInt(headers.get(HEADER_X_TOTAL_COUNT));
    return count ? this.renderLicenses() : this.renderNoLicenses();
  }

  renderLoading() {
    return (
      <section className="container page-licenses loading">
        <header>
          <h1>Licenses</h1>
        </header>
        <main>
          <img src={Images.Quill} />
        </main>
      </section>
    )
  }

  private renderLicenses() {
    return (
      <section className="container page-licenses">
        <header>
          <h1>Licenses</h1>
          <SearchInput
            className="search"
            value={this.state.searchQuery}
            onChange={searchQuery => this.setState({searchQuery})}
            placeholder="Search Licenses" />
        </header>
        <LicensesFilters
          selectedId={this.state.selectedFilter}
          onOptionSelected={selectedFilter => this.setState({selectedFilter})} />
        <LicensesByProfile
          publicKey={this.props.publicKey}
          searchQuery={this.state.searchQuery}
          relationship={this.selectedFilterRelationship()}
          limit={Configuration.pagination.visiblePageCount}
          showActions={false} />
      </section>
    )
  }

  private renderNoLicenses() {
    return (
      <section className="container page-licenses no-licenses">
        <header>
          <h1>Licenses</h1>
        </header>
        <main>
          <div className="circle"></div>
          <div className="message">
            You have no licenses yet — <Link to="/works">browse published works</Link> to buy some or <Link to="/create-work">register a new work</Link> of your own to start selling licenses.
          </div>
        </main>
      </section>
    )
  }

  private selectedFilterRelationship(): LicenseToProfileRelationship {
    switch (this.state.selectedFilter) {
      case LicensesFilters.ALL:
        return 'relatedTo';
      case LicensesFilters.SOLD:
        return 'emitter';
      case LicensesFilters.PURCHASED:
        return 'holder';
    }
  }
}
