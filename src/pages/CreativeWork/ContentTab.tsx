import * as React from 'react';

import CreativeWorkComponent, { CreativeWorkProps } from '../../components/CreativeWorkComponent';

function renderAttributes(props: CreativeWorkProps): JSX.Element {
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

function render(props: CreativeWorkProps): JSX.Element {
  return (
    <div className="contentTab">
      <h1>Content</h1>
      <div className="attributes">
        { renderAttributes(props) }
      </div>
      <div className="content">{ props.content }</div>
    </div>
  )
}

export default CreativeWorkComponent(render);