import * as React from 'react';
import { Link } from 'react-router';

import './LandingLoggedIn.scss';

import LatestBlocks from '../../components/LatestBlocks';
import LatestWorks from '../../components/LatestWorks';

export interface LandingProps {
}

export class LandingLoggedIn extends React.Component<LandingProps, undefined> {
  render() {
    return (
      <div className="landing-logged-in">
        <h1>Poet</h1>
        <h4 className="mb-2">Proof of existence for transactions</h4>
        <section className="search mb-3">
          <div className="mb-1"><input type="text" placeholder="search for works" /></div>
          <div><button className="btn btn-primary">Poet Search</button></div>
        </section>
        <section className="row">
          <div className="col-sm-6">
            <LatestBlocks/>
          </div>
          <div className="col-sm-6">
            <LatestWorks/>
          </div>
        </section>
      </div>
    )
  }
}
