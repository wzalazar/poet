import * as React from 'react';
import ProfileComponent, { ProfileProps } from '../../hocs/ProfileComponent';

import './Overview.scss';
import { Images } from '../../images/Images';

function render(props: ProfileProps) {
  return (
    <div className="overview col-sm-3">
      <div className="avatar"><img src={props.attributes && props.attributes.imageData || Images.Anon}/></div>
      <h2>{props.attributes && props.attributes.displayName || 'Anonymous'}</h2>
      <div className="bio">{ props.attributes && props.attributes.bio }</div>
      <div className="publicKey">Identifier: <pre>{ props.id }</pre></div>
      <ul>
        { props.attributes && props.attributes.email && <li><div>{props.attributes.email}</div></li> }
      </ul>
    </div>
  )
}

export const Overview = ProfileComponent(render);