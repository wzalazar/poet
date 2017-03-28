import * as React from 'react';

import { Images } from '../../images/Images';
import { Hash } from '../../components/atoms/Hash';
import ProfileComponent, { ProfileProps } from '../../components/hocs/ProfileComponent';

import './Overview.scss';

function render(props: ProfileProps) {
  return (
    <div className="overview col-sm-3">
      <div className="avatar"><img src={props.attributes && props.attributes.imageData || Images.Anon}/></div>
      <h2>{props.attributes && props.attributes.displayName || 'Anonymous'}</h2>
      <div className="bio">{ props.attributes && props.attributes.bio }</div>
      <ul>
        { props.id && <li className="id"><div className="key">id</div><Hash className="copyable-hash-no-button" textClickable>{props.id}</Hash></li> }
        { props.attributes && props.attributes.email && <li><img src={Images.Mail} /><div>{props.attributes.email}</div></li> }
      </ul>
    </div>
  )
}

export const Overview = ProfileComponent(render);