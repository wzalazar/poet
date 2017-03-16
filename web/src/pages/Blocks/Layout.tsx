import * as React from 'react';

import LatestWorks from '../../components/LatestWorks'
import BlockHeader from './components/Header'
import { BlockInfo } from '../../Interfaces';
import { Blocks } from './Blocks';

import './Layout.scss'

interface BlocksLayoutProps {
  readonly blocks: BlockInfo[];
}

export class BlocksLayout extends React.Component<BlocksLayoutProps, undefined> {

  render() {
    return (
      <div className="container">
        <section className="blocks">
          <BlockHeader />
          <div className="row">
            <Blocks className="col-sm-6 col-md-4" blocks={this.props.blocks} />
            <div className="col-sm-6 col-md-8">
              <LatestWorks limit={20} />
            </div>
          </div>
        </section>
      </div>
    )
  }
}

