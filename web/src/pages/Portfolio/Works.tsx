import * as React from 'react';
import { WorkNameWithLink, WorkType, WorkPublishedDate, OwnerNameWithLink } from '../../atoms/Work';
import { Work } from '../../atoms/Interfaces';
import { PoetAPIResourceProvider } from '../../atoms/base/PoetApiResource';
import { SelectWorksByOwner } from '../../atoms/Arguments';

export class OwnedWorks extends PoetAPIResourceProvider<Work[], SelectWorksByOwner, undefined> {

  poetURL(): string {
    return `/works?owner=${this.props.owner}`
  }

  renderElement(resource: Work[]): JSX.Element {
    return (
      <div className="portfolio-works">
        <table className="table table-hover">
          <thead>
          <tr>
            <td>Name</td>
            <td>Author</td>
            <td>Timestamped</td>
            <td>Notary</td>
            <td>Actions</td>
          </tr>
          </thead>
          <tbody>
          { resource.map(work => this.renderRow(work)) }
          </tbody>
        </table>
      </div>
    )
  }

  renderRow(props: Work) {
    return (
      <tr key={props.id}>
        <td>
          <WorkType work={props} />
          <WorkNameWithLink work={props} />
        </td>
        <td><OwnerNameWithLink work={props}/></td>
        <td><WorkPublishedDate work={props}/></td>
        <td>Poet</td>
        <td>
          <select>
            <option>Edit</option>
            <option>Transfer</option>
            <option>Delete</option>
          </select>
        </td>
      </tr>
    )
  }
}
