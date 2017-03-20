import * as React from 'react';

import { Work } from '../../../Interfaces';
import WorkComponent from '../../../components/hocs/WorkComponent';

import './TechnicalTab.scss';

function render(props: Work): JSX.Element {
  if (!props.claimInfo) {
    return <div className="technical-tab">Could not load technical information.</div>
  }
  return (
    <div className="technical-tab">
      <table>
        <tbody>
        {
          Object.entries(props.claimInfo).filter(([key, value]) => key !== 'id').map(([key, value]) => (
            <tr key={key}>
              <td>{ key }</td><td>{ value }</td>
            </tr>
          ))
        }
        </tbody>
      </table>
    </div>
  )
}

export default WorkComponent(render);