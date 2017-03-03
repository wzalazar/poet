import * as React from 'react';

import '../../extensions/Map';
import WorkComponent from '../../hocs/WorkComponent';
import ProfileLink from '../../components/ProfileLink';
import './Overview.scss';
import { Work } from '../../atoms/Interfaces';

function renderRow({key, value}: {key: string, value: string}) {
  return (
    <tr key={key}>
      <td>{key}</td>
      <td>{value}</td>
    </tr>
  );
}

function render(props: Work) {
  if (!props) {
    return '';
  }

  const tableData = new Map<string, any>();
  tableData.set('Published', props.attributes.datePublished);
  tableData.set('Last Modified', props.attributes.dateModified);
  props.attributes.tags && tableData.set('Tags', props.attributes.tags || []);
  tableData.set('Type', props.attributes.articleType || 'Unknown');

  return (
    <div className="overview">
      <h1>{props.attributes.name}</h1>
      <table>
        <tbody>
          <tr key="author">
            <td>Author</td>
            <td>{
              props.attributes.author
              ? props.attributes.author
              : props.attributes.authorPublicKey
                ? <ProfileLink id={props.attributes.authorPublicKey} />
                : 'Unknown author'
            }
            </td>
          </tr>
            { tableData.toKeyValueArray().map(renderRow) }
        </tbody>
      </table>
    </div>
  )
}

export default WorkComponent(render);