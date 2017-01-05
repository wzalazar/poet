import * as React from "react";
import { connect } from "react-redux";

import './style.scss';

export interface OverviewProps {
  title: string;
  author: string;
  published: Date;
  lastModified: Date;
  customLabel: string;
  tags: string[];
  type: string;
}

type PropsToElement<T> = (_: T) => JSX.Element;
type GetProps<T> = (_: any) => T

class Presenter<Props> {

  view: PropsToElement<Props>;
  selector: GetProps<Props>;

  constructor(view: PropsToElement<Props>, selector: GetProps<Props>) {
    this.view = view;
    this.selector = selector;
  }

  getClass() {
    return connect(this.selector)(this.view)
  }
}

function overviewView(props: OverviewProps) {
  const tableData = new Map();
  tableData.set('Author', props.author);
  tableData.set('Published', props.published);
  tableData.set('Last Modified', props.lastModified);
  tableData.set('Custom Label', props.customLabel);
  tableData.set('Tags', props.tags);
  tableData.set('Type', props.type);

  return (
    <div>
      <h1>{props.title}</h1>
      <table className="overview">
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

const claimSelector = (state: any) => ({
  title: 'adsasdf',
  author: 'Satoshi',
  published: new Date(),
  lastModified: new Date(),
  customLabel: 'Label',
  tags: ['asdf', 'asdf'],
  type: 'Article',
});

export default new Presenter<OverviewProps>(overviewView, claimSelector).getClass();