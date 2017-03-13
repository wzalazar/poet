import * as React from 'react';
import { browserHistory } from 'react-router';

import { Configuration } from '../config';
import { UrlObject } from '../common';
import { DispatchesTransferRequested } from '../actions/requests';
import { WorkNameWithLink, WorkType, WorkPublishedDate } from '../atoms/Work';
import { Work } from '../atoms/Interfaces';
import { PoetAPIResourceProvider, HEADER_X_TOTAL_COUNT } from '../atoms/base/PoetApiResource';
import { SelectWorksByOwner } from '../atoms/Arguments';
import { DropdownMenu } from '../components/DropdownMenu';
import { Pagination } from '../components/Pagination';

import './WorksByProfile.scss';

const EDIT = 'Edit';
const TRANSFER = 'Transfer';

export type WorkToProfileRelationship = 'author' | 'owner' | 'relatedTo';

interface WorksByProfileProps {
  readonly relationship: WorkToProfileRelationship;
  readonly query: string;
  readonly showActions?: boolean;
  readonly limit?: number;
}

interface WorksByProfileState {
  readonly offset?: number;
}

export class WorksByProfile extends PoetAPIResourceProvider<Work[], WorksByProfileProps & SelectWorksByOwner & DispatchesTransferRequested, WorksByProfileState> {

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
        query: this.props.query
      }
    }
  }

  componentWillReceiveProps(props: WorksByProfileProps) {
    if (this.props.relationship !== props.relationship)
      this.setState({ offset: 0 })
  }

  renderElement(works: Work[], headers: Headers): JSX.Element {
    const count = headers.get(HEADER_X_TOTAL_COUNT) && parseInt(headers.get(HEADER_X_TOTAL_COUNT));

    if (!count)
      return this.renderNoWorks();

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
            <span className="media-type">{work.attributes.mediaType} / {work.attributes.articleType}</span>
            <span className="content-info">{work.attributes.wordCount} words at {work.attributes.fileSize} bytes</span>
          </div>
          <WorkType work={work} />
        </td>
        <td className="hash">{work.id}</td>
        <td className="timestamp"><WorkPublishedDate work={work}/></td>
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
      <section>{ !this.props.query ? 'No works to show' : 'No works match the given criteria' }</section>
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
