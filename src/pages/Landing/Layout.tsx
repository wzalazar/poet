import * as React from 'react';
import { Link } from 'react-router';

import './style.scss';

import LatestBlocks from '../../components/LatestBlocks';
import LatestWorks from '../../components/LatestWorks';

export interface LandingProps {
}

export class LandingLayout extends React.Component<LandingProps, undefined> {
  render() {
    return (
      <div className="landing">
        <h1>Poet is a platform for managing <br/> timestamped intellectual property</h1>
        <h2>Built on the bitcoin blockchain, the most secure globally verifiable
        <br/> record of human history the world has ever seen</h2>
        <div className="cta-header">
          <button className="btn btn-outline-primary">Learn more</button>
        </div>
        <div className="row landing-boxes mb-3">
          <div className="col-sm-4">
            <section>
              <LatestBlocks />
            </section>
          </div>
          <div className="col-sm-4">
            <section className="raised boxed">
              <div className="invisible"/>
              <div className="number">$10,500,00</div>
              <div className="explain">raised</div>
            </section>
          </div>
          <div className="col-sm-4">
            <section className="registered boxed">
              <div className="invisible"/>
              <div className="number">1.4M</div>
              <div className="explain">works registered</div>
            </section>
          </div>
        </div>
        <div>
          <LatestWorks/>
        </div>
      </div>
    )
  }
}
