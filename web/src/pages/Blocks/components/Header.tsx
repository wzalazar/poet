import * as React from 'react'

import { Configuration } from '../../../configuration';
import FetchComponent from '../../../hocs/FetchComponent'

const NumberOfPeers = FetchComponent(
  () => ({ url: Configuration.api.explorer + '/node '}),
  (props => <span>{props.peers}</span>)
);

const Status = FetchComponent(
  () => ({ url: Configuration.api.explorer + '/node '}),
  (props => <span>{props.status}</span>)
);

export interface OverrideHeaderTitleProps {
  title?: string
}

export default (props?: OverrideHeaderTitleProps) => (<div className="header">
  <div className="row">
    <div className="col-sm-12">
      <h3>{ props && props.title || 'Block Explorer' }</h3>
    </div>
  </div>
  <div className="row">
  <div className="col-sm-6">
    Connected to <strong>https://node1.po.et/</strong>
  </div>
  <div className="col-sm-3">
  <strong>Peers:</strong> <NumberOfPeers />
  </div>
  <div className="col-sm-3">
    <strong>Status:</strong> <Status />
  </div>
  </div>
</div>)
