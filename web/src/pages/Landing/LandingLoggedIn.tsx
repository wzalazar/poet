import * as React from 'react';

import './LandingLoggedIn.scss';

import { Images } from '../../images/Images';

import LatestBlocks from '../../components/LatestBlocks';
import LatestWorks from '../../components/LatestWorks';

export interface LandingProps {
  dispatchSearch: () => any,
  dispatchSearchChange: (searchQuery: string) => any
}

export class LandingLoggedIn extends React.Component<LandingProps, undefined> {

  render() {
    const search = (ev: any) => {
      ev.preventDefault()
      this.props.dispatchSearch()
    }
    const updateSearch = (ev: any) => {
      this.props.dispatchSearchChange(ev.target.value)
    }
    return (
      <section className="landing-logged-in">
        <div className="container">
          <img className="logo" src={Images.Logo} />
          <section className="search">
            <form onSubmit={search}>
              <div><input type="text" onChange={updateSearch} /></div>
              <div><button>Poet Search</button></div>
            </form>
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
