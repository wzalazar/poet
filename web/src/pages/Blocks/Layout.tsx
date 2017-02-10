import * as React from 'react';
import * as moment from 'moment';
import { Link } from 'react-router';

import LatestWorks from '../../components/LatestWorks'
import BlockHeader from './components/Header'

import './Layout.scss'
import config from '../../config'

export interface BlockInfo {
  torrentHash: string

  transactionHash?: string
  outputIndex?: number

  // Only available if confirmed
  bitcoinHash?: string
  bitcoinHeight?: number
  transactionOrder?: number
  timestamp?: number

  // Only available if downloaded
  hash?: string

  // Only available if indexed
  height?: number
}

interface BlockList {
  blocks: BlockInfo[]
}

function displayHeight(number: any) {
  return '# ' + number;
}


function DisplayBlock(block: BlockInfo) {
  const idField = block.hash
    ? <Link to={`/blocks/${block.hash}`}>
        {block.hash.firstAndLastCharacters(4)}
      </Link>
    : block.torrentHash.firstAndLastCharacters(4)
  return (<tr key={block.torrentHash}>
    <td>{displayHeight(block.height)}</td>
    <td>{ idField }</td>
    <td>{moment(block.timestamp*1000).fromNow()}</td>
    <td>{block.bitcoinHeight}</td>
  </tr>)
}

export default class BlockLayout extends React.Component<BlockList, undefined> {

  render() {
    return (
      <div className="container">
        <section className="blocks">
          <BlockHeader />
          <div className="row">
            <div className="leftCol col-sm-6 col-md-4">
              <div className="headHeight">
                <div className="number">
                  {this.props.blocks[0] && this.props.blocks[0].height}
                </div>
                <div className="desc">
                  block height
                </div>
              </div>
              <table className="table">
                <tbody>
                  { this.props.blocks.map(DisplayBlock) }
                </tbody>
              </table>
            </div>
            <div className="col-sm-6 col-md-8">
              <LatestWorks />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

