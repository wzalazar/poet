import * as React from 'react';

import '../../extensions/String';

import { OwnerName, WorkNameById } from '../../atoms/Work';
import { License } from '../../atoms/Interfaces';
import { TimeSinceIssueDate, ReferencedWorkName, ReferencedWorkNameWithLink } from '../../atoms/License';
import { OfferingType } from '../../atoms/Offering';
import { PoetAPIResourceProvider, HEADER_X_TOTAL_COUNT } from '../../atoms/base/PoetApiResource';
import { DropdownMenu } from '../../components/DropdownMenu';
import { Pagination } from '../../components/Pagination';

import './Licenses.scss';

type LicensesResource = ReadonlyArray<License>;

export type LicenseToProfileRelationship = 'relatedTo' | 'emitter' | 'holder';

export interface LicensesProps {
  readonly publicKey?: string;
  readonly limit: number;
  readonly showActions?: boolean;
  readonly searchQuery?: string;
  readonly relation: LicenseToProfileRelationship
}

interface LicensesState {
  readonly offset?: number;
}

export class Licenses extends PoetAPIResourceProvider<LicensesResource, LicensesProps, LicensesState> {
  static defaultProps: Partial<LicensesProps> = {
    showActions: false,
    searchQuery: '',
    relation: 'relatedTo'
  };

  constructor() {
    super(...arguments);
    this.state = {
      offset: 0
    }
  }

  poetURL() {
    return {
      url: `/licenses`,
      query: {
        limit: this.props.limit,
        offset: this.state.offset,
        [this.props.relation]: this.props.publicKey,
        query: this.props.searchQuery
      }
    }
  }

  renderElement(licenses: LicensesResource, headers: Headers) {
    return (licenses && licenses.length) ? this.renderLicenses(licenses, headers) : this.renderNoLicenses();
  }

  private renderLicenses(licenses: LicensesResource, headers: Headers) {
    const count = headers.get(HEADER_X_TOTAL_COUNT) && parseInt(headers.get(HEADER_X_TOTAL_COUNT));
    return (
      <section className="licenses">
        <ul className="licenses">
          { licenses.map(this.renderLicense.bind(this)) }
        </ul>
        { count > this.props.limit && <Pagination
          offset={this.state.offset}
          limit={this.props.limit}
          count={count}
          visiblePageCount={6}
          onClick={offset => this.setState({offset})}
          className="pagination"
          disabledClassName="disabled"/> }
      </section>
    )
  }

  private renderNoLicenses() {
    return (
      <section className="licenses">
        <div>You don't have any licenses yet!</div>
      </section>
    )
  }

  private renderLicense(license: License) {
    return (
      <li key={license.id}>
        <header>
          <h2><ReferencedWorkNameWithLink license={license} /></h2>
          { this.props.showActions && this.renderLicenseDropdownMenu(license) }
        </header>
        <main>
          <div>Offering Type: <OfferingType offering={license.referenceOffering} /></div>
          <div><TimeSinceIssueDate license={license} /></div>
          <div>Owned by: <OwnerName workId={ license.reference.id }/></div>
        </main>
      </li>
    )
  }

  private renderLicenseDropdownMenu(license: License) {
    return (
      <div className="menu">
        <DropdownMenu options={['Revoke']} onOptionSelected={this.optionSelected.bind(this, license)}>
          Actions
        </DropdownMenu>
      </div>
    );
  }

  private optionSelected(license: any, option: string) {
    console.log('optionSelected', license, option);
  }

}