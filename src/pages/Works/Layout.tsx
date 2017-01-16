import * as React from 'react';

import './Layout.scss';
import WorksComponent from './Works';

export class WorksLayout extends React.Component<undefined, undefined> {
  render() {
    return (
      <div className="works">
        <WorksComponent />
      </div>
    )
  }
}
