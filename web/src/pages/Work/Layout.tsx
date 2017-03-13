import * as React from 'react';

import { HexString } from '../../common';

import { WorkOffering } from '../../atoms/Interfaces';
import Overview from './Overview';
import { WorkOfferings } from './WorkOfferings';
import Title from './Title';
import { WorkTabs } from './WorkTabs';

import './Layout.scss';

export interface WorkProps {
  id: HexString,
  purchase: (offering: WorkOffering) => void;
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
            <WorkOfferings workId={workId} onPurchaseRequest={this.props.purchase}/>
            <Title id={workId}/>
          </div>
        </div>
      </section>
    )
  }
}
