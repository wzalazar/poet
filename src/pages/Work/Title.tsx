import * as React from 'react';

import WorkComponent, { WorkProps } from '../../hocs/WorkComponent';

import './Title.scss';

function render(props: WorkProps): JSX.Element {
  return (
    <section className="title">
      <h3>Title</h3>
      <table>
        <tbody>
          <tr>
            <td>Owner</td>
            <td>{props.title.attributes.owner}</td>
          </tr>
          <tr>
            <td>Type of Ownership</td>
            <td>{props.title.attributes.typeOfOwnership}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{props.title.attributes.status}</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default WorkComponent(render);