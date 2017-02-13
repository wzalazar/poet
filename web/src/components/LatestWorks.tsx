import * as React from 'react';
import { Link } from 'react-router';
import * as moment from 'moment';

import '../extensions/String';

import './LatestWorks.scss';

import Config from '../config';
import { ClassNameProps } from '../common';

import { WorkProps } from '../hocs/WorkComponent';

import { ProfileLink } from './ProfileLink';
import { ResourceProvider } from './ResourceProvider';

type LatestWorksResource = ReadonlyArray<WorkProps>;

export interface LatestWorksProps extends ClassNameProps {
  readonly limit?: number;
  readonly showLink?: boolean;
}

export default class LatestBlocks extends ResourceProvider<LatestWorksResource, LatestWorksProps, undefined> {
  static defaultProps: LatestWorksProps = {
    limit: 5
  };

  renderElement(works: LatestWorksResource) {
    return (
      <table className="latest-works">
        <thead>
          <tr>
            <td className="title" colSpan={2}>
              Latest Works
            </td>
            <td className="view-latest">
              { this.props.showLink && <Link to="/blocks">View Latest »</Link> }
            </td>
          </tr>
        </thead>
        <tbody>
          { works.map(this.renderWork.bind(this)) }
        </tbody>
      </table>
    );
  }

  resourceLocator() {
    return { url: `${Config.api.explorer}/works?limit=${this.props.limit}` }
  }

  private renderWork(props: WorkProps) {
    return (
      <tr key={props.id}>
        <td className="work-name">
          <Link to={'/works/' + props.id}>{props.attributes.name}</Link>
          {/*<div className="author">{ props.attributes.authorPublicKey ? <ProfileLink id={props.attributes.authorPublicKey} /> : 'Unknown author' }</div>*/}
        </td>
        <td className="id">
          {props.id && props.id.firstAndLastCharacters(4)}
        </td>
        <td className="date">
          {moment(props.attributes.createdAt).fromNow()}
        </td>
      </tr>
    )
  }

}