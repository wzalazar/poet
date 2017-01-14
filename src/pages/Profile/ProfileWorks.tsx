import * as React from 'react';
import { Link } from 'react-router';

import { FetchComponentProps } from '../../components/FetchComponent';
import WorksComponent from '../../components/Works';
import { WorkProps } from '../../components/WorkComponent';

//import './Layout.scss';

function renderTableRow(props: WorkProps) {
  return (
    <tr key={props.id}>
      <td><Link to={'/works/' + props.id}>{props.name}</Link></td>
      <td>{props.publicKey}</td>
      <td>{props.published}</td>
    </tr>
  )
}

function render(props: FetchComponentProps) {
  return (
    <div className="profile-works">
      <h4>Latest Works</h4>
      <table className="table table-hover">
        <tbody>
          { props.elements.map(renderTableRow) }
        </tbody>
      </table>
    </div>
  )
}

export default WorksComponent(render);