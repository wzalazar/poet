import * as React from 'react';
import { Link } from 'react-router';

import { FetchComponentProps } from '../../components/FetchComponent';
import WorksComponent from '../../components/Works';
import { WorkProps } from '../../components/WorkComponent';

//import './Layout.scss';

function renderTableRow(props: WorkProps) {
  return (
    <tr key={props.id}>
      <td>
        <div>
          <Link to={'/works/' + props.id}>{props.name}</Link>
        </div>
        <div>
          <small className="mr-2">{ props.type }</small><small>365 words at 8kb</small>
        </div>
      </td>
      <td>{props.publicKey}</td>
      <td>{props.published}</td>
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

function render(props: FetchComponentProps) {
  return (
    <div className="portfolio-works">
      <table className="table table-hover">
        <thead>
          <th>Name</th>
          <th>Hash</th>
          <th>Timestamped</th>
          <th>Notary</th>
          <th>Actions</th>
        </thead>
        <tbody>
        { props.elements.map(renderTableRow) }
        </tbody>
      </table>
    </div>
  )
}

export default WorksComponent(render);