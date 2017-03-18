import * as React from 'react';

import { Work } from '../../../Interfaces';
import WorkComponent from '../../../components/hocs/WorkComponent';

import './ContentTab.scss';

function renderAttributes(props: Work): JSX.Element {
  console.log();
  return (
    <table>
      <tbody>
      {
        Object.entries(props.attributes).filter(([key, value]) => key !== 'content').map(([key, value]) => (
          <tr key={key}>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        ))
      }
      </tbody>
    </table>
  );
}

function render(props: Work): JSX.Element {
  return (
    <section className="content-tab">
      <section className="attributes">
        { renderAttributes(props) }
      </section>
      <section className="content">{ props.attributes.content }</section>
    </section>
  )
}

export default WorkComponent(render);