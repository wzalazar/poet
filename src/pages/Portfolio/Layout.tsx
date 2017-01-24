import * as React from 'react';

import { HexString } from '../../common';

import PortfolioWorks from './Works'
import { PortfolioWorksFilters } from './WorksFilters';

import './Layout.scss';

interface PortfolioProps {
  userId: HexString;
}

export class PortfolioLayout extends React.Component<PortfolioProps, undefined> {
  render() {
    return (
      <section className="portfolio">
        <h2>Portfolio</h2>
        <PortfolioWorksFilters/>
        <PortfolioWorks author={this.props.userId} />
      </section>
    )
  }
}
