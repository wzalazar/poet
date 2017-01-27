import * as React from 'react';

import WorkComponent, { WorkProps } from '../../hocs/WorkComponent';

import './ContentTab.scss';

function renderAttributes(props: WorkProps): JSX.Element {
  return (
    <table>
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
    <section className="contentTab">
      <section className="attributes">
        { renderAttributes(props) }
      </section>
      <section className="content">{ props.attributes.content }</section>
    </section>
  )
}

export default WorkComponent(render);