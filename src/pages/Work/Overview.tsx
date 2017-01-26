import * as React from 'react';

import WorkComponent, { WorkProps } from '../../hocs/WorkComponent';
import ProfileLink from '../../components/ProfileLink';

import './Layout.scss';

function render(props: WorkProps) {
  if (!props) {
    return '';
  }
  const tableData = new Map();
  tableData.set('Published', props.attributes.publishedAt);
  tableData.set('Last Modified', props.attributes.lastModified);
  tableData.set('Tags', props.attributes.tags || []);
  tableData.set('Type', props.attributes.mediaType || 'Unknown');

  return (
    <div className="overview">
      <h1>{props.attributes.name}</h1>
      <table>
        <colgroup>
          <col className="keys"/>
          <col className="values"/>
        </colgroup>
        <tbody>
        <tr key="author">
          <td>Author</td>
          <td><ProfileLink id={props.author} /></td>
        </tr>
        {
          [...tableData.keys()].filter(key => tableData.get(key)).map(key => (
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