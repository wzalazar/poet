import * as React from 'react';
import { browserHistory } from 'react-router'
import * as moment from 'moment';

import { LicenseType } from '../../common';
import { Work } from '../../atoms/Interfaces';
import { PoetAPIResourceProvider, HEADER_X_TOTAL_COUNT } from '../../atoms/base/PoetApiResource';
import { WorkNameWithLink, AuthorWithLink } from '../../atoms/Work';
import { TimeElapsedSinceTimestamp } from '../../atoms/Claim';
import { Pagination } from '../../components/Pagination';

import './Works.scss';

type WorksResource = ReadonlyArray<Work>;

export interface WorksProps {
  readonly offset?: number;
  readonly limit?: number;
  readonly dateFrom?: moment.Moment;
  readonly dateTo?: moment.Moment;
  readonly query?: string;
  readonly sortBy?: string;
  readonly licenseType?: LicenseType;
}

export class WorksComponent extends PoetAPIResourceProvider<WorksResource, WorksProps, undefined> {
  static defaultProps: WorksProps = {
    offset: 0,
    limit: 10
  };

  poetURL() {
    return {
      url: '/works',
      query: {
        offset: this.props.offset,
        limit: this.props.limit,
        dateFrom: this.props.dateFrom && this.props.dateFrom.toDate().getTime(),
        dateTo: this.props.dateTo && this.props.dateTo.toDate().getTime(),
        query: this.props.query,
        sortBy: this.props.sortBy,
        licenseType: this.props.licenseType && this.props.licenseType.id
      }
    }
  }

  renderElement(works: WorksResource, headers: Headers) {
    const count = headers.get(HEADER_X_TOTAL_COUNT) && parseInt(headers.get(HEADER_X_TOTAL_COUNT));
    return (
      <section className="works container">
        <h4 className="work-count">Showing {works.length} of {count} Results</h4>
        <div className="row">
          <div className="col-md-8">
            <ul className="works">
              { works.map(this.renderWork) }
            </ul>
          </div>
        </div>
        { count > this.props.limit && <Pagination
          className="pagination"
          offset={this.props.offset}
          limit={this.props.limit}
          count={count}
          visiblePageCount={5}
          onClick={ offset => browserHistory.push({pathname: 'works', query: { offset }})}
          disabledClassName="disabled"
        /> }
      </section>
    )
  }

  renderLoading() {
    return (
      <section className="works-results container loading">
        <p>Loading, please wait...</p>
      </section>
    )
  }

  renderWork(props: Work) {
    return (
      <li key={props.id} className="mb-3">
        <div className="name"><WorkNameWithLink work={props} /></div>
        <div className="info">
          <span className="timestamp">Timestamped <TimeElapsedSinceTimestamp claimInfo={props.claimInfo} />&nbsp;</span>
          <span className="author">by <AuthorWithLink work={props}/> </span>
        </div>
        <div className="content">{props.attributes.content}</div>
      </li>
    )
  }

}