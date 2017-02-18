import * as React from 'react';

import './Layout.scss';
import { WorksComponent } from './Works';
import { FiltersComponent } from './Filters';

interface WorksLayoutProps {
  readonly location?: {
    readonly query: {
      readonly offset: string;
    }
  }
}

export class WorksLayout extends React.Component<WorksLayoutProps, undefined> {

  render() {
    return (
      <section className="works">
        <FiltersComponent/>
        <WorksComponent
          offset={parseInt(this.props.location.query.offset) || 0}
          limit={10} />
      </section>
    )
  }
}
