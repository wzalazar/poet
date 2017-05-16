import * as React from 'react';
import { Link } from 'react-router';
import { Work, ClassNameProps } from 'poet-js';

import '../../extensions/String';

import { Configuration } from '../../configuration';
import { ResourceProvider } from '../ResourceProvider';
import { WorkNameWithLink, WorkStampedDate } from '../atoms/Work';

import './LatestWorks.scss';

type LatestWorksResource = ReadonlyArray<Work>;

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
              { this.props.showLink && <Link to="/blocks">View Latest</Link> }
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
    return { url: `${Configuration.api.explorer}/works?limit=${this.props.limit}` }
  }

  private renderWork(props: Work) {
    return (
      <tr key={props.id}>
        <td className="work-name">
          <WorkNameWithLink work={props} />
        </td>
        <td className="id">
          {props.id && props.id.firstAndLastCharacters(6)}
        </td>
        <td className="date">
          <WorkStampedDate work={props}/>
        </td>
      </tr>
    )
  }

}