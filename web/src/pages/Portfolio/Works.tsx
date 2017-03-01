import * as React from 'react';
import { WorkNameWithLink, WorkType, WorkPublishedDate, OwnerNameWithLink } from '../../atoms/Work';
import { Work } from '../../atoms/Interfaces';
import { PoetAPIResourceProvider } from '../../atoms/base/PoetApiResource';
import { SelectWorksByOwner } from '../../atoms/Arguments';
import { DropdownMenu } from '../../components/DropdownMenu';
import { browserHistory } from 'react-router';
import { DispatchesTransferRequested } from '../../actions/requests';

import './Works.scss';

const EDIT = 'Edit'
const TRANSFER = 'Transfer'



export class OwnedWorks extends PoetAPIResourceProvider<Work[], SelectWorksByOwner & DispatchesTransferRequested, undefined> {

  poetURL(): string {
    return `/works?owner=${this.props.owner}`
  }

  renderElement(works: Work[]): JSX.Element {
    return (
      <div className="portfolio-works">
        <table className="table table-hover">
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
      </div>
    )
  }

  renderRow(work: Work) {
    return (
      <tr key={work.id}>
        <td>
          <WorkType work={work} />
          <WorkNameWithLink work={work} />
        </td>
        <td>{work.id}</td>
        <td><WorkPublishedDate work={work}/></td>
        <td>
          <div className="menu">
            <DropdownMenu
              className="dropdown"
              options={[EDIT, TRANSFER]}
              onOptionSelected={this.optionSelected.bind(this, work)}>
              Actions
            </DropdownMenu>
          </div>
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
