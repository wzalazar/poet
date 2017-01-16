import * as React from 'react';

import './Layout.scss';

import Overview from './Overview';
import Tabs from './Tabs';
import WorkOfferings from './WorkOfferings';
import Title from './Title';
import { HexString } from '../../common';

export interface WorkProps {
  id: HexString
}

export class WorkLayout extends React.Component<WorkProps, undefined> {
  render() {
    const workId = this.props.id;

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
