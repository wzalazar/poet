import * as React from 'react';

import CreativeWorkComponent, { CreativeWorkProps } from '../../components/CreativeWorkComponent';

import './style.scss';

function render(props: CreativeWorkProps) {
  const tableData = new Map();
  tableData.set('Author', props.author);
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

export default CreativeWorkComponent(render);