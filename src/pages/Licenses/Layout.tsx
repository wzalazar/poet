import * as React from 'react';

import { HexString } from '../../common';

import Licenses from './Licenses'
import { LicensesFilters } from './LicensesFilters';

import './Layout.scss';

interface LicensesProps {
  userId: HexString;
}

export class LicensesLayout extends React.Component<LicensesProps, undefined> {
  render() {
    return (
      <section className="licenses">
        <h2>Licenses</h2>
        <LicensesFilters/>
        <Licenses author={this.props.userId} />
      </section>
    )
  }
}
