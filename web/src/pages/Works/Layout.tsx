import * as React from 'react';

import './Layout.scss';
import WorksComponent from './Works';
import { FiltersComponent } from './Filters';

export class WorksLayout extends React.Component<undefined, undefined> {
  render() {
    return (
      <section className="works">
        <FiltersComponent/>
        <WorksComponent />
      </section>
    )
  }
}
