import * as React from 'react';
import { Link } from 'react-router';

import ProfileComponent, { ProfileProps } from './ProfileComponent';

function render(props: ProfileProps) {
  return (
    <Link to={'/profiles/' + props.id}>{props.name}</Link>
  )
}

export default ProfileComponent(render);