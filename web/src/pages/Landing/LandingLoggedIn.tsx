import * as React from 'react';

import './LandingLoggedIn.scss';

import { Images } from '../../images/Images';

import LatestBlocks from '../../components/LatestBlocks';
import LatestWorks from '../../components/LatestWorks';

export interface LandingProps {
}

export class LandingLoggedIn extends React.Component<LandingProps, undefined> {
  render() {
    return (
      <section className="landing-logged-in">
        <div className="container">
          <img className="logo" src={Images.Logo} />
          <section className="search">
            <div><input type="text" /></div>
            <div><button>Poet Search</button></div>
          </section>
        </div>
        <div className="latest-blocks-and-works">
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <LatestBlocks/>
              </div>
              <div className="col-sm-6">
                <LatestWorks showLink={true} />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}
