import * as React from "react";

import './style.scss';

export interface OverviewProps {
  author: string;
  published: Date;
  lastModified: Date;
  customLabel: string;
  tags: string[];
  type: string;
}

export default class Overview extends React.Component<OverviewProps, undefined> {

  render() {
    const tableData = new Map();
    tableData.set('Author', this.props.author);
    tableData.set('Published', this.props.published);
    tableData.set('Last Modified', this.props.lastModified);
    tableData.set('Custom Label', this.props.customLabel);
    tableData.set('Tags', this.props.tags);
    tableData.set('Type', this.props.type);

    return (
      <table className="overview">
        <col className="keys"/>
        <col className="values"/>
        <tbody>
        {
          [...tableData.keys()].map(key => (
            <tr>
              <td>{key}</td>
              <td>{tableData.get(key)}</td>
            </tr>
          ))
        }
        </tbody>
      </table>
    )
  }
}
