import * as React from 'react';
import { FetchComponentProps } from '../../hocs/FetchComponent';
import WorksComponent from '../../hocs/Works';
import { Work } from '../../atoms/Interfaces';
import { WorkNameWithLink, WorkPublishedDate } from '../../atoms/Work';


function renderTableRow(props: Work) {
  return (
    <tr key={props.id}>
      <td><WorkNameWithLink work={props} /></td>
      <td><WorkPublishedDate work={props}/></td>
    </tr>
  )
}

function render(props: FetchComponentProps) {
  return (
    <div className="profile-works">
      <table className="table table-hover">
        <tbody>
          { props.elements.map(renderTableRow) }
        </tbody>
      </table>
    </div>
  )
}

export default WorksComponent(render);