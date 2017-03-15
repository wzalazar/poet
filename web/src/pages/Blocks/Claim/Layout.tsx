import * as React from 'react'

import { Configuration } from '../../../configuration';
import FetchComponent from '../../../hocs/FetchComponent'
import BlockHeader from '../components/Header'

import './Layout.scss'

const DisplayClaim = (claim: any) => (<div key={claim.id} className="contents">
  <div className="monospaced">
    Public Key
    <pre>{claim.publicKey}</pre>
  </div>
  <div className="monospaced">
    Signature
    <pre>{claim.signature}</pre>
  </div>
  <div className="monospaced">
    Contents
    <pre>{JSON.stringify(claim.attributes, null, 2)}</pre>
  </div>
</div>)

const Layout = FetchComponent(
  (props: {id: string}) => ({ url: `${Configuration.api.explorer}/claims/${props.id}`}),
  (claim =>
    <div className="container">
      <h3>Block Explorer - View Claim</h3>
      <h4><pre>{claim.id}</pre></h4>
      <section className="singleClaim">
        <DisplayClaim {...claim} />
      </section>
    </div>
  )
);

export default Layout
