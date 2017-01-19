import * as React from 'react';

import WorkComponent, { WorkProps } from '../../hocs/WorkComponent';

function render(props: WorkProps): JSX.Element {
  return (
    <div className="title">
      <h3>Title</h3>
      <table>
        <colgroup>
          <col className="keys"/>
          <col className="values"/>
        </colgroup>
        <tbody>
          <tr>
            <td>Owner</td>
            <td>{props.title.owner}</td>
          </tr>
          <tr>
            <td>Type of Ownership</td>
            <td>{props.title.typeOfOwnership}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{props.title.status}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default WorkComponent(render);