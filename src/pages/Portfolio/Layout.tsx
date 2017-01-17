import * as React from 'react';

import { HexString } from '../../common';

import PortfolioWorks from './PortfolioWorks'

import './Layout.scss';

interface PortfolioProps {
  userId: HexString;
}

export class PortfolioLayout extends React.Component<PortfolioProps, undefined> {
  render() {
    return (
      <section className="portfolio">
        <h1>PORTFOLIO</h1>
        <PortfolioWorks author={this.props.userId} />
      </section>
    )
  }
}
