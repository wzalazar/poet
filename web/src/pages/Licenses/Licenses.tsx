import * as React from 'react';

import '../../extensions/String';

import { OwnerName, WorkNameById } from '../../atoms/Work';
import { License } from '../../atoms/Interfaces';
import { TimeSinceIssueDate, ReferencedWorkName } from '../../atoms/License';
import { OfferingType } from '../../atoms/Offering';
import { PoetAPIResourceProvider, HEADER_X_TOTAL_COUNT } from '../../atoms/base/PoetApiResource';
import { DropdownMenu } from '../../components/DropdownMenu';
import { Pagination } from '../../components/Pagination';

import './Layout.scss';

type LicensesResource = ReadonlyArray<License>;

export interface LicensesProps {
  readonly publicKey?: string;
  readonly limit?: number;
  readonly showActions?: boolean;
  readonly searchQuery?: string;
  readonly relation?: 'all' | 'sold' | 'purchased'
}

interface LicensesState {
  readonly offset?: number;
}

export class Licenses extends PoetAPIResourceProvider<LicensesResource, LicensesProps, LicensesState> {
  static defaultProps: LicensesProps = {
    limit: 100,
    showActions: false,
    searchQuery: ''
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
        holder: this.props.publicKey,
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
        <ul className="row list-unstyled">
          { licenses.map(this.renderLicense.bind(this)) }
        </ul>
        <Pagination
          offset={this.state.offset}
          limit={10}
          count={count}
          visiblePageCount={6}
          onClick={offset => this.setState({offset})}
          className="pagination"
          disabledClassName="disabled"/>
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
      <li key={license.id} className="card col-sm-5 col-sm-3 col-lg-3 m-1">
        <div className="card-block">
          <div className="card-title " >
            <h5><ReferencedWorkName license={license} /></h5>
            { this.props.showActions && <div className="menu">
              <DropdownMenu options={['Revoke']} onOptionSelected={this.optionSelected.bind(this, license)}>
                Actions
              </DropdownMenu>
            </div> }
          </div>
          <div>
            <div className="box-placeholder" />
            <div>
              <div><OfferingType offering={license.referenceOffering} /></div>
              <div><TimeSinceIssueDate license={license} /></div>
            </div>
          </div>
          <div>Owned by: <OwnerName workId={ license.reference.id }/></div>
        </div>
      </li>
    )
  }

  private optionSelected(license: any, option: string) {
    console.log('optionSelected', license, option);
  }

}