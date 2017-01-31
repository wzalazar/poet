import * as React from 'react';

import '../../extensions/String';

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
            <td>{props.title.attributes.owner.firstAndLastCharacters(6)}</td>
          </tr>
          <tr>
            <td>Type of Ownership</td>
            <td>{props.title.attributes.typeOfOwnership || 'Single Ownership'}</td>
          </tr>
          <tr style={{display: 'none'}}>
            <td>Status</td>
            <td>{props.title.attributes.status}</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default WorkComponent(render);