import * as React from 'react'

import FetchComponent from '../../../hocs/FetchComponent'
import config from '../../../config'

const NumberOfPeers = FetchComponent(
  () => ({ url: config.api.explorer + '/node '}),
  (props => <span>{props.peers}</span>)
);

const Status = FetchComponent(
  () => ({ url: config.api.explorer + '/node '}),
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
