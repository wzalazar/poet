import * as React from "react";

import Overview from './Overview';
import './style.scss';
import { OverviewProps } from './Overview';
import Tabs from './Tabs';
import { HistoryTabProps } from './Tabs';
import { ContentTabProps } from './Tabs';

export interface LicenseProps {
  title: string;
  overview: OverviewProps,
  content: ContentTabProps,
  history: HistoryTabProps
}

export class LicenseLayout extends React.Component<LicenseProps, undefined> {

  render() {
    return (
      <div className="license">
        <h1>{this.props.title}</h1>
        <Overview {...this.props.overview} />
        <Tabs content={...this.props.content} history={...this.props.history} />
      </div>
    )
  }
}
