import * as React from 'react';

import './style.scss';
import Overview from './Overview';
import Tabs from './Tabs';

export class CreativeWorkLayout extends React.Component<undefined, undefined> {
  render() {
    return (
      <div className="creativeWork">
        <div className="leftColumn">
          <Overview id="334s" />
          <Tabs id="334s" />
        </div>
        <div className="rightColumn">
          { /*
          <Licenses />
          <Title />
          */ }
        </div>
      </div>
    )
  }
}
