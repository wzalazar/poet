import * as React from 'react';
import { browserHistory } from 'react-router';

import { Images } from '../../images/Images';
import { Configuration } from '../../configuration';
import { UrlObject } from '../../common';
import { DispatchesTransferRequested } from '../../actions/requests';
import { Work } from '../../Interfaces';
import { PoetAPIResourceProvider, HEADER_X_TOTAL_COUNT } from '../atoms/base/PoetApiResource';
import { WorkNameWithLink, WorkType, WorkPublishedDate } from '../atoms/Work';
import { SelectWorksByOwner } from '../atoms/Arguments';
import { Hash } from '../atoms/Hash';
import { Pagination } from '../molecules/Pagination';
import { DropdownMenu } from '../DropdownMenu';

import './WorksByProfile.scss';
import { TimeElapsedSinceTimestamp } from '../atoms/Claim';

const EDIT = 'Edit';
const TRANSFER = 'Transfer';

export type WorkToProfileRelationship = 'author' | 'owner' | 'relatedTo' | 'licensedTo';

interface WorksByProfileProps extends SelectWorksByOwner, DispatchesTransferRequested {
  readonly relationship: WorkToProfileRelationship;
  readonly searchQuery: string;
  readonly showActions?: boolean;
  readonly limit?: number;
}

interface WorksByProfileState {
  readonly offset?: number;
}

export class WorksByProfile extends PoetAPIResourceProvider<Work[], WorksByProfileProps, WorksByProfileState> {

  static defaultProps: Partial<WorksByProfileProps> = {
    limit: Configuration.pagination.limit
  };

  constructor() {
    super(...arguments);
    this.state = {
      offset: 0
    }
  }

  poetURL(): UrlObject {
    return {
      url: `/works`,
      query: {
        [this.props.relationship]: this.props.owner,
        limit: this.props.limit,
        offset: this.state.offset,
        query: this.props.searchQuery
      }
    }
  }

  componentWillReceiveProps(props: WorksByProfileProps) {
    if (this.props.relationship !== props.relationship)
      this.setState({ offset: 0 })
  }

  renderElement(works: Work[], headers: Headers) {
    const count = headers.get(HEADER_X_TOTAL_COUNT) && parseInt(headers.get(HEADER_X_TOTAL_COUNT));

    if (!count)
      return this.renderNoWorks();
    else
      return this.renderWorks(works, count);

  }

  renderLoading() {
    return (
      <section className="works-by-profile loading">
        <table className="works">
          <thead>
          <tr>
            <td>Name</td>
            <td>Hash</td>
            <td>Timestamp</td>
            { this.props.showActions && <td>Actions</td> }
          </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={this.props.showActions ? 4 : 3}><img src={Images.Quill} /></td>
            </tr>
          </tbody>
        </table>
      </section>
    )
  }

  private renderWorks(works: Work[], count: number) {
    return (
      <section className="works-by-profile">
        <table className="works">
          <thead>
          <tr>
            <td>Name</td>
            <td>Hash</td>
            <td>Timestamp</td>
            { this.props.showActions && <td>Actions</td> }
          </tr>
          </thead>
          <tbody>
          { works.map(this.renderWork.bind(this)) }
          </tbody>
        </table>

        <Pagination
          offset={this.state.offset}
          limit={this.props.limit}
          count={count}
          visiblePageCount={Configuration.pagination.visiblePageCount}
          onClick={offset => this.setState({offset})}
          className="pagination"
          disabledClassName="disabled"/>
      </section>
    )
  }

  private renderWork(work: Work) {
    return (
      <tr key={work.id}>
        <td className="name">
          <WorkNameWithLink work={work} />
          <div>
            <span className="media-type">
              { work.attributes.mediaType }
              { work.attributes.articleType && ` / ${work.attributes.articleType}`}
            </span>
            <span className="content-info">
              {work.attributes.wordCount && <span>{work.attributes.wordCount} word{parseInt(work.attributes.wordCount) > 1 && 's'} {work.attributes.fileSize && 'at '}</span>}
              {work.attributes.fileSize && <span>{work.attributes.fileSize} bytes</span>}
            </span>
          </div>
          <WorkType work={work} />
        </td>
        <td className="hash"><Hash className="copyable-hash-no-button" textClickable>{work.id}</Hash></td>
        <td className="timestamp"><TimeElapsedSinceTimestamp claimInfo={work.claimInfo}/></td>
        { this.props.showActions && <td>
          <DropdownMenu
            className="dropdown"
            options={[EDIT, TRANSFER]}
            onOptionSelected={this.optionSelected.bind(this, work)}>
            Actions
          </DropdownMenu>
        </td> }
      </tr>
    )
  }

  private renderNoWorks() {
    return (
      <section>{ this.props.children || (!this.props.searchQuery ? 'No works to show' : 'No works match the given criteria') }</section>
    )
  }

  private optionSelected(work: Work, action: string) {
    switch (action) {
      case EDIT:
        browserHistory.push('/works/' + work.id + '/edit');
        return;
      case TRANSFER:
        this.props.transferRequested(work.id);
        return;
    }
  }
}
