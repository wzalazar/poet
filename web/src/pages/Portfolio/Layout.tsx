import * as React from 'react';

import { OwnedWorks } from './Works';
import { SelectProfileById } from '../../atoms/Arguments';

import './Layout.scss';
import { DispatchesTransferRequested } from '../../actions/requests';

export class PortfolioLayout extends React.Component<SelectProfileById & DispatchesTransferRequested, undefined> {
  render() {
    return (
      <section className="container portfolio">
        <h2>Portfolio</h2>
        { /* <PortfolioWorksFilters/> */ }
        <OwnedWorks owner={this.props.profileId} transferRequested={this.props.transferRequested}/>
      </section>
    )
  }
}
