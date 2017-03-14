import * as React from 'react';
import { Link } from 'react-router';

import { Configuration } from '../../../configuration';
import FetchComponent from '../../../hocs/FetchComponent'
import BlockHeader from '../components/Header'

import './Layout.scss'

const Item = (props: { name: string, value: string }) => <div> <span>{props.name}</span> <span>{props.value}</span></div>

const BlockInfo = (block: any) => (
  <div>
    <Item name="Torrent Hash" value={block.torrentHash} />
    <Item name="Height" value={block.height} />
    <Item name="Bitcoin Hash" value={block.bitcoinHash} />
    <Item name="Bitcoin Height" value={block.bitcoinHeight} />
    <Item name="Number of Claims" value={block.claims.length} />
  </div>
)

const displayType = (type: string) => {
  switch (type) {
    case 'Work': return 'Creative Work';
    case 'License': return 'License';
    case 'Offering': return 'License Offering';
    case 'Profile': return 'Profile';
    case 'Title': return 'Title of Ownership';
    case 'Certificate': return 'Certificate';
    case 'Revokation': return 'Revokation';
    default: return 'Unknown kind: ' + type;
  }
}

const displayDescription = (claim: any) => {
  switch (claim.type) {
    case 'Work': return claim.attributes.name || 'Untitled ' + claim.id;
    case 'Profile': return claim.attributes.displayName || 'Unnamed ' + claim.publicKey;
    default: return claim.attributes.for ? 'for ' + claim.attributes.for : claim.id;
  }
}

const makeLink = (claim: any) => {
  switch (claim.type) {
    case 'Work': return `/works/${claim.id}`;
    case 'Profile': return `/profiles/${claim.publicKey}`;
    default: return `/claims/${claim.id}`
  }
}

const DisplayClaim = (claim: any) => (<div key={claim.id}>
  <Link to={makeLink(claim)}>{displayType(claim.type)}: {displayDescription(claim)}</Link>
</div>)

const ClaimList = (block: any) => <div>{block.claims.map(DisplayClaim)}</div>

const Layout = FetchComponent(
  (props: {id: string}) => ({ url: `${Configuration.api.explorer}/blocks/${props.id}`}),
  (block =>
    <div className="container">
      <section className="blocks">
        <BlockHeader title={`Block #${block.id}`} />
        <div className="row">
          <div className="leftCol col-sm-6 col-md-4">
            <BlockInfo {...block} />
          </div>
          <div className="col-sm-6 col-md-8">
            <ClaimList {...block} />
          </div>
        </div>
      </section>
    </div>
  )
);

export default Layout
