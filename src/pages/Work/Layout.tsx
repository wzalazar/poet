import * as React from 'react';

import './Layout.scss';

import Overview from './Overview';
import Tabs from './Tabs';
import WorkOfferings from './WorkOfferings';
import Title from './Title';

export class WorkLayout extends React.Component<undefined, undefined> {
  render() {
    const workId = '334s';

    return (
      <div className="work row">
        <div className="col-xs-7">
          <Overview id={workId} />
          <Tabs id={workId} />
        </div>
        <div className="col-xs-1" />
        <div className="col-xs-4">
          <WorkOfferings workId={workId} />
          <Title id={workId} />
        </div>
      </div>
    )
  }
}
