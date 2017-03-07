import * as React from 'react';
import ProfileComponent, { ProfileProps } from '../../hocs/ProfileComponent';

import './Overview.scss';

function render(props: ProfileProps) {
  return (
    <div className="overview col-sm-3">
      <div className="avatar"><img src={props.attributes.imageData}/></div>
      <h2>{props.attributes.displayName}</h2>
      <div className="bio">A short description of the publishers name and background</div>
      <ul>
        { props.attributes.email && <li><div>{props.attributes.email}</div></li> }
      </ul>
    </div>
  )
}

export const Overview = ProfileComponent(render);