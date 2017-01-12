import * as React from 'react';

import WorkComponent, { WorkProps } from '../../components/WorkComponent';

function renderAttributes(props: WorkProps): JSX.Element {
  return (
    <table>
      <colgroup>
        <col className="keys"/>
        <col className="values"/>
      </colgroup>
      <tbody>
      {
        Object.keys(props.attributes).map(key => (
          <tr key={key}>
            <td>{key}</td>
            <td>{props.attributes[key]}</td>
          </tr>
        ))
      }
      </tbody>
    </table>
  );
}

function render(props: WorkProps): JSX.Element {
  return (
    <div className="contentTab">
      <div className="attributes">
        { renderAttributes(props) }
      </div>
      <div className="content">{ props.content }</div>
    </div>
  )
}

export default WorkComponent(render);