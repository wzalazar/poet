import * as React from 'react';

import './Layout.scss';

import { HexString } from '../../common';

import Overview from './Overview';
import WorkOfferings from './WorkOfferings';
import Title from './Title';
import { WorkTabs } from './WorkTabs';

export interface WorkProps {
  id: HexString
}

export class WorkLayout extends React.Component<WorkProps, undefined> {
  render() {
    const workId = this.props.id;

    return (
      <section className="container work">
        <div className="row">
          <div className="col-xs-7">
            <Overview id={workId}/>
            <WorkTabs id={workId}/>
          </div>
          <div className="col-xs-1"/>
          <div className="col-xs-4">
            <WorkOfferings id={workId}/>
            <Title id={workId}/>
          </div>
        </div>
      </section>
    )
  }
}
