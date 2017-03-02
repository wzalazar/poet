import * as React from 'react';
import { browserHistory } from 'react-router';

import { WorkNameWithLink, WorkType, WorkPublishedDate } from '../../atoms/Work';
import { Work } from '../../atoms/Interfaces';
import { PoetAPIResourceProvider, HEADER_X_TOTAL_COUNT } from '../../atoms/base/PoetApiResource';
import { SelectWorksByOwner } from '../../atoms/Arguments';
import { DropdownMenu } from '../../components/DropdownMenu';
import { Pagination } from '../../components/Pagination';
import { DispatchesTransferRequested } from '../../actions/requests';

import './Works.scss';
import { UrlObject } from '../../common';

const EDIT = 'Edit'
const TRANSFER = 'Transfer'

interface OwnedWorksState {
  readonly offset?: number;
}

export class OwnedWorks extends PoetAPIResourceProvider<Work[], SelectWorksByOwner & DispatchesTransferRequested, OwnedWorksState> {

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
        owner: this.props.owner,
        limit: 10,
        offset: this.state.offset
      }
    }
  }

  renderElement(works: Work[], headers: Headers): JSX.Element {
    const count = headers.get(HEADER_X_TOTAL_COUNT) && parseInt(headers.get(HEADER_X_TOTAL_COUNT));

    return (
      <div className="portfolio-works">
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Hash</td>
              <td>Timestamp</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            { works.map(this.renderRow.bind(this)) }
          </tbody>
        </table>

        <Pagination
          offset={this.state.offset}
          limit={10}
          count={count}
          visiblePageCount={6}
          onClick={offset => this.setState({offset})}
          className="pagination"
          disabledClassName="disabled"/>
      </div>
    )
  }

  renderRow(work: Work) {
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
        <td>
          <DropdownMenu
            className="dropdown"
            options={[EDIT, TRANSFER]}
            onOptionSelected={this.optionSelected.bind(this, work)}>
            Actions
          </DropdownMenu>
        </td>
      </tr>
    )
  }

  optionSelected(work: Work, action: string) {
    console.log('optionSelected', work, action);
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
