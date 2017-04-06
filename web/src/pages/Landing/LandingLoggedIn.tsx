import * as React from 'react';

import './LandingLoggedIn.scss';

import { Images } from '../../images/Images';

import LatestBlocks from '../../components/molecules/LatestBlocks';
import LatestWorks from '../../components/molecules/LatestWorks';

export interface LandingProps {
  dispatchSearch: () => any,
  dispatchSearchChange: (searchQuery: string) => any
}

export class LandingLoggedIn extends React.Component<LandingProps, undefined> {

  render() {
    return (
      <section className="landing-logged-in">
        <div className="container">
          <img className="logo" src={Images.Logo} />
          <section className="search">
            <form onSubmit={this.onSearch}>
              <div><input type="text" onChange={this.updateSearch} /></div>
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

  private onSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.dispatchSearch();
  };

  private updateSearch = (event: React.FormEvent<HTMLInputElement>) => {
    this.props.dispatchSearchChange(event.currentTarget.value);
  };

}
