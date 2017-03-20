import * as React from 'react';

import { HexString } from '../../common';
import { WorkOffering, Work } from '../../Interfaces';

import Overview from './Overview';
import { WorkOfferings } from './WorkOfferings';
import Title from './Title';
import { WorkTabs } from './WorkTabs';

import './Layout.scss';

export interface WorkProps {
  readonly id: HexString,
  readonly purchase: (work: Work, offering: WorkOffering) => void;
}

export class WorkLayout extends React.Component<WorkProps, undefined> {
  render() {
    return (
      <section className="container page-work">
        <div className="row">
          <div className="col-xs-7">
            <Overview id={this.props.id}/>
          </div>
          <div className="col-xs-1"/>
          <div className="col-xs-4">
            <WorkOfferings workId={this.props.id} onPurchaseRequest={this.props.purchase}/>
            <Title id={this.props.id}/>
          </div>
        </div>
        <WorkTabs id={this.props.id}/>
      </section>
    )
  }
}
