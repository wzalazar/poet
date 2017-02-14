import * as React from 'react';
import { Link } from 'react-router';

import { FetchComponentProps } from '../../hocs/FetchComponent';
import WorksComponent from '../../hocs/Works';
import { WorkProps } from '../../hocs/WorkComponent';
import { ResourceProvider, ResourceLocator } from '../../components/ResourceProvider';

export class PortfolioWorks extends ResourceProvider<WorkProps, undefined, undefined> {
  renderElement(resource: WorkProps): JSX.Element {
    return undefined;
  }

  resourceLocator(): ResourceLocator {
    return undefined;
  }

}

function renderTableRow(props: WorkProps) {
  return (
    <tr key={props.id}>
      <td>
        <div>
          <Link to={'/works/' + props.id}>{props.attributes.name}</Link>
        </div>
        <div>
          <small className="mr-2">{ props.attributes.type }</small>
          <small>{props.attributes.name}</small>
        </div>
      </td>
      <td>{props.publicKey}</td>
      <td>{props.attributes.publishedAt}</td>
      <td></td>
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

function render(props: WorkProps) {
  return (
    <div className="portfolio-works">
      <table className="table table-hover">
        <thead>
          <tr>
            <td>Name</td>
            <td>Hash</td>
            <td>Timestamped</td>
            <td>Notary</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          { props.elements.map(renderTableRow) }
        </tbody>
      </table>
    </div>
  )
}

export default WorksComponent(render);