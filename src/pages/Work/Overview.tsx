import * as React from 'react';
import { Link } from 'react-router';

import WorkComponent, { WorkProps } from '../../components/WorkComponent';

import './Layout.scss';

function render(props: WorkProps) {
  const tableData = new Map();
  tableData.set('Published', props.published);
  tableData.set('Last Modified', props.lastModified);
  tableData.set('Custom Label', props.customLabel);
  tableData.set('Tags', props.tags);
  tableData.set('Type', props.type);

  return (
    <div className="overview">
      <h1>{props.name}</h1>
      <table>
        <colgroup>
          <col className="keys"/>
          <col className="values"/>
        </colgroup>
        <tbody>
        <tr key="author">
          <td>Author</td>
          <td><Link to="/profiles/1">{props.author}</Link></td>
        </tr>
        {
          [...tableData.keys()].map(key => (
            <tr key={key}>
              <td>{key}</td>
              <td>{tableData.get(key).toString()}</td>
            </tr>
          ))
        }
        </tbody>
      </table>
    </div>
  )
}

export default WorkComponent(render);