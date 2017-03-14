import * as React from 'react'

import { Configuration } from '../../../config';
import FetchComponent from '../../../hocs/FetchComponent'
import BlockHeader from '../components/Header'

import './Layout.scss'

const DisplayClaim = (claim: any) => (<div key={claim.id}>
  <div className="monospaced">{claim.publicKey}</div>
  <div className="monospaced">{claim.signature}</div>
  <div className="monospaced">{JSON.stringify(claim.attributes)}</div>
</div>)

const Layout = FetchComponent(
  (props: {id: string}) => ({ url: `${Configuration.api.explorer}/claims/${props.id}`}),
  (claim =>
    <div className="container">
      <section className="blocks">
        <BlockHeader title={`Block Explorer - Claim #${claim.id}`} />
        <div className="row">
          <div className="col-sm-3 col-md-4">
          </div>
          <div className="col-sm-6 col-md-4">
            <DisplayClaim {...claim} />
          </div>
        </div>
      </section>
    </div>
  )
);

export default Layout
