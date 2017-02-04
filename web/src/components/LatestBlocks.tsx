import * as React from 'react';
import { Link } from 'react-router';
import * as moment from 'moment';

import '../extensions/String';
import './LatestBlocks.scss';

import Config from '../config';
import { ClassNameProps } from '../common';

import { ResourceProvider } from './ResourceProvider';

interface Block {
  readonly torrentHash: string;
  readonly height: string;
  readonly id: string;
  readonly timestamp: number;
}

type LatestBlocksResource = ReadonlyArray<Block>;

export interface LatestBlocksProps extends ClassNameProps {
  readonly limit?: number;
}

export default class LatestBlocks extends ResourceProvider<LatestBlocksResource, LatestBlocksProps, undefined> {
  static defaultProps: LatestBlocksProps = {
    limit: 5
  };

  renderElement(blocks: LatestBlocksResource) {
    return (
      <table className={`table table-hover latest-blocks ${this.props.className}`}>
        <thead>
        <tr>
          <th colSpan={2}>Poet Blockchain</th>
          <th className="more-link"><Link to="/blocks">view all »</Link></th>
        </tr>
        </thead>
        <tbody>
          { blocks.map(this.renderBlock.bind(this)) }
        </tbody>
      </table>
    );
  }

  resourceLocator() {
    return { url: `${Config.api.explorer}/blocks?limit=${this.props.limit}` }
  }

  private renderBlock(props: Block) {
    return (
      <tr key={props.torrentHash}>
        <td><span className="text-truncate">{props.height}</span></td>
        <td><span className="text-truncate">{props.id
          ? <Link to={`/blocks/${props.id}`}>{props.id.firstAndLastCharacters(4)}</Link>
          : 'not ready'
        }</span></td>
        <td>{moment(props.timestamp * 1000).fromNow()}</td>
      </tr>
    )
  }

}