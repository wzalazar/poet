import * as React from 'react';

import ProfileComponent, { ProfileProps } from '../../hocs/ProfileComponent';

function render(props: ProfileProps) {
  return (
    <div className="col-sm-3">
      <div><img className="img-thumbnail mb-2" src={props.attributes.imageData}/></div>
      <h3>{props.attributes.displayName}</h3>
      <div className="lead text-truncate mb-2">{props.claim.publicKey}</div>
      <ul className="list-unstyled">
        { props.attributes.email && <li>{props.attributes.email}</li> }
      </ul>
    </div>
  )
}

export default ProfileComponent(render);