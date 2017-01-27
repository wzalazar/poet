import * as React from 'react';

import '../../extensions/Map';

import WorkComponent, { WorkProps } from '../../hocs/WorkComponent';
import ProfileLink from '../../components/ProfileLink';

import './Overview.scss';

function renderRow({key, value}: {key: string, value: string}) {
  return (
    <tr key={key}>
      <td>{key}</td>
      <td>{value}</td>
    </tr>
  );
}

function render(props: WorkProps) {
  if (!props) {
    return '';
  }
  const tableData = new Map<string, any>();
  tableData.set('Published', props.attributes.publishedAt);
  tableData.set('Last Modified', props.attributes.lastModified);
  tableData.set('Tags', props.attributes.tags || []);
  tableData.set('Type', props.attributes.articleType || 'Unknown');

  return (
    <div className="overview">
      <h1>{props.attributes.name}</h1>
      <table>
        <tbody>
          <tr key="author">
            <td>Author</td>
            <td><ProfileLink id={props.attributes.authorPublicKey} /></td>
          </tr>
            { tableData.toKeyValueArray().map(renderRow) }
        </tbody>
      </table>
    </div>
  )
}

export default WorkComponent(render);