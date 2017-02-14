import * as React from 'react';
import { Link } from 'react-router';

import { FetchComponentProps } from '../../hocs/FetchComponent';
import WorksComponent from '../../hocs/Works';
import { WorkProps } from '../../hocs/WorkComponent';


function renderTableRow(props: WorkProps) {
  return (
    <tr key={props.id}>
      <td><Link to={'/works/' + props.id}>{props.attributes.name}</Link></td>
      <td>{props.publicKey}</td>
      <td>{props.attributes.publishedAt}</td>
    </tr>
  )
}

function render(props: FetchComponentProps) {
  return (
    <div className="profile-works">
      <table className="table table-hover">
        <tbody>
          { props.elements.map(renderTableRow) }
        </tbody>
      </table>
    </div>
  )
}

export default WorksComponent(render);