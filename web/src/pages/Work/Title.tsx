import * as React from 'react';

import '../../extensions/String';

import { Work } from '../../Interfaces';
import WorkComponent from '../../components/hocs/WorkComponent';
import { ProfileLink } from '../../components/ProfileLink';

import './Title.scss';

function render(props: Work): JSX.Element {
  const owner = props.title && props.title.attributes && props.title.attributes.owner
  return (
    <section className="title">
      <h3>Title</h3>
      <table>
        <tbody>
          { owner &&
            <tr>
              <td>Owner</td>
              <td><ProfileLink id={owner} /></td>
            </tr>
          }
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