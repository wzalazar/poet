import * as React from 'react';

import { HexString } from '../../common';

import { SearchInput } from '../../atoms/SearchInput';
import { Licenses } from './Licenses'
import { Filters } from './Filters';

import './Layout.scss';

interface LicensesProps {
  publicKey: HexString;
}

interface LicensesLayoutState {
  readonly selectedFilter?: string;
  readonly searchQuery?: string;
}

export class LicensesLayout extends React.Component<LicensesProps, LicensesLayoutState> {

  constructor() {
    super(...arguments);
    this.state = {
      selectedFilter: Filters.ALL,
      searchQuery: ''
    }
  }

  render() {
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
        <Filters
          selectedId={this.state.selectedFilter}
          onOptionSelected={selectedFilter => this.setState({selectedFilter})} />
        <Licenses
          publicKey={this.props.publicKey}
          searchQuery={this.state.searchQuery} />
      </section>
    )
  }
}
