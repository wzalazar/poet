import * as React from 'react';
import { Link } from 'react-router';

import ProfileComponent, { ProfileProps } from '../hocs/ProfileComponent';

function render(props: ProfileProps) {
  return (
    <Link to={'/profiles/' + props.id}>{props.attributes['displayName'] }</Link>
  )
}

export default ProfileComponent(render);