import * as React from 'react';

import '../../extensions/Map';
import { Work } from '../../Interfaces';
import WorkComponent from '../../components/hocs/WorkComponent';
import { AuthorWithLink } from '../../components/atoms/Work';

import './Overview.scss';
import moment = require('moment');
import { Configuration } from '../../configuration';

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

  props.attributes.datePublished &&
  tableData.set('Published', moment(parseInt(props.attributes.datePublished, 10)).format(Configuration.dateFormat));

  props.attributes.dateModified &&
  tableData.set('Last Modified', moment(parseInt(props.attributes.dateModified, 10)).format(Configuration.dateFormat));

  props.attributes.tags && tableData.set('Tags', props.attributes.tags || []);

  tableData.set('Type', props.attributes.mediaType || 'Unknown');

  props.attributes.articleType &&
  tableData.set('Article type', props.attributes.articleType || 'Unknown');

  return (
    <div className="overview">
      <h1>{props.attributes.name}</h1>
      <table>
        <tbody>
          <tr key="author">
            <td>Author</td>
            <td><AuthorWithLink work={props} /></td>
          </tr>
            { tableData.toKeyValueArray().map(renderRow) }
        </tbody>
      </table>
    </div>
  )
}

export default WorkComponent(render);