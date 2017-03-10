import * as React from 'react';
import * as moment from 'moment';

import './Layout.scss';
import { WorksComponent } from './Works';
import { FiltersComponent } from './Filters';
import { LicenseType, LicenseTypes } from '../../common';

interface WorksLayoutProps {
  readonly location?: {
    readonly query: {
      readonly offset: string;
    }
  }
  readonly query: string;
}

export interface WorksLayoutState {
  readonly dateFrom?: moment.Moment;
  readonly dateTo?: moment.Moment;
  readonly sortBy?: string;
  readonly licenseType?: LicenseType;
}

export class WorksLayout extends React.Component<WorksLayoutProps, WorksLayoutState> {

  constructor() {
    super(...arguments);
    this.state = {
      licenseType: LicenseTypes[0],
      sortBy: 'datePublished',
      dateFrom: moment().subtract(1, 'month'),
      dateTo: moment()
    };
  }

  render() {
    return (
      <section className="page-works">
        <FiltersComponent
          dateFrom={this.state.dateFrom}
          dateTo={this.state.dateTo}
          sortBy={this.state.sortBy}
          licenseType={this.state.licenseType}
          onDateFromChanged={dateFrom => this.setState({ dateFrom })}
          onDateToChanged={dateTo => this.setState({ dateTo })}
          onSortChange={sortBy => this.setState({ sortBy })}
          onLicenseTypeChange={licenseType => this.setState({ licenseType })}
        />
        <WorksComponent
          offset={parseInt(this.props.location.query.offset) || 0}
          limit={10}
          sortBy={this.state.sortBy}
          dateFrom={this.state.dateFrom}
          dateTo={this.state.dateTo}
          query={this.props.query}
          licenseType={this.state.licenseType}
        />
      </section>
    )
  }
}
