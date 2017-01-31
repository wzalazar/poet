import * as React from 'react';
import { Link } from 'react-router';
import * as moment from 'moment';

import '../extensions/String';

import './LatestWorks.scss';

import { WorkProps } from '../hocs/WorkComponent';

import { ProfileLink } from './ProfileLink';
import { ResourceProvider } from './ResourceProvider';

import Config from '../config';

type LatestWorksResource = ReadonlyArray<WorkProps>;

export interface LatestWorksProps {
  readonly className?: string;
  readonly limit?: number;
  readonly showLink?: boolean;
}

export default class LatestBlocks extends ResourceProvider<LatestWorksResource, LatestWorksProps, undefined> {
  static defaultProps: LatestWorksProps = {
    limit: 5
  };

  renderElement(works: LatestWorksResource) {
    return (
      <section className="latest-works p-2">
        <header>
          <h5>Latest Timestamps</h5>
          { this.props.showLink && <div className="more-link"><Link to="/blocks">view all »</Link></div> }
        </header>
        <ul className="list-unstyled">
          { works.map(this.renderWork.bind(this)) }
        </ul>
      </section>
    );
  }

  resourceLocator() {
    return { url: `${Config.api.explorer}/works?limit=${this.props.limit}` }
  }

  private renderWork(props: WorkProps) {
    return (
      <li key={props.id} className="row py-1">
        <div className="col-sm-8 mb-1 text-left">
          <h3><Link to={'/works/' + props.id}>{props.attributes.name}</Link></h3>
          <div>{ props.attributes.authorPublicKey ? <ProfileLink id={props.attributes.authorPublicKey} /> : 'Unknown author' }</div>
        </div>
        <div className="col-sm-4 text-right">
          <div className="mb-1">{props.publicKey}</div>
          <div>{moment(props.attributes.createdAt).fromNow()}</div>
        </div>
      </li>
    )
  }

}