import * as React from 'react';

import { Work } from '../../Interfaces';
import WorkComponent from '../../components/hocs/WorkComponent';

function render(props: Work): JSX.Element {
  return (
    <div className="technicalTab">
      <h1>Technical</h1>
      <table>
        <tbody>
        {
          Object.keys(props.claimInfo)
            .filter(info => info !== 'id')
            .map(info => {
              return (<tr>
                <td>{ info }</td><td>{ (props.claimInfo as any)[info] }</td>
                </tr>
              )
            })
        }
        </tbody>
      </table>
    </div>
  )
}

export default WorkComponent(render);