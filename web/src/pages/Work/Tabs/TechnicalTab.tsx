import * as React from 'react';

import { Work } from '../../../Interfaces';
import WorkComponent from '../../../components/hocs/WorkComponent';

import './TechnicalTab.scss';

function render(props: Work): JSX.Element {
  return (
    <div className="technical-tab">
      <table>
        <tbody>
        {
          Object.entries(props.claimInfo).filter(([key, value]) => key !== 'id').map(([key, value]) => (
            <tr>
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