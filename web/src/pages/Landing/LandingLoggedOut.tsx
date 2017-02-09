import * as React from 'react';

import './LandingLoggedOut.scss';

import LatestBlocks from '../../components/LatestBlocks';
import LatestWorks from '../../components/LatestWorks';
import { Reviews } from './Reviews';
import { Partners } from './Partners';

export interface LandingProps {
}

export class LandingLoggedOut extends React.Component<LandingProps, undefined> {
  render() {
    return (
      <section className="landing-logged-out">
        <h1>Poet is a platform for managing <br/> timestamped intellectual property</h1>
        <h2>Built on the bitcoin blockchain, the most secure globally verifiable
        <br/> record of human history the world has ever seen</h2>
        <div className="cta-header">
          <button className="">Learn more</button>
        </div>
        <section className="row landing-boxes">
          <section className="col-sm-4">
            {/*<LatestBlocks />*/}
          </section>
          <section className="col-sm-4 boxed">
            <div className="number">$1,000,000</div>
            <div className="explain">Amount Raised</div>
          </section>
          <section className="col-sm-4 registered boxed">
            <div className="number">12,014</div>
            <div className="explain">Creative Works Registered</div>
          </section>
        </section>
        <div>
          <LatestWorks/>
        </div>
        <Reviews/>
        <Partners/>
      </section>
    )
  }
}
