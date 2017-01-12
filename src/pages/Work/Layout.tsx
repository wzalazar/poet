import * as React from 'react';

import './style.scss';

import Overview from './Overview';
import Tabs from './Tabs';
import WorkOfferings from './WorkOfferings';

export class WorkLayout extends React.Component<undefined, undefined> {
  render() {
    const workId = '334s';

    return (
      <div className="work">
        <div className="leftColumn">
          <Overview id={workId} />
          <Tabs id={workId} />
        </div>
        <div className="rightColumn">
          <WorkOfferings workId={workId} />
          {/*<Title />*/}
        </div>
      </div>
    )
  }
}
