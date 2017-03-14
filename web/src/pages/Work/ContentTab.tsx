import * as React from 'react';

import WorkComponent from '../../hocs/WorkComponent';

import './ContentTab.scss';
import { Work } from '../../atoms/Interfaces';

function renderAttributes(props: Work): JSX.Element {
  return (
    <table>
      <tbody>
      {
        Object.keys(props.attributes).filter(key => key !== 'content').map(key => (
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

function render(props: Work): JSX.Element {
  return (
    <section className="contentTab">
      <section className="attributes">
        { renderAttributes(props) }
      </section>
      <pre className="content">{ props.attributes.content }</pre>
    </section>
  )
}

export default WorkComponent(render);