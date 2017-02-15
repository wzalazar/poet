import * as React from 'react';
import { Link } from 'react-router';

import ProfileComponent, { ProfileProps } from '../hocs/ProfileComponent';

function render(props: ProfileProps) {
  if (props.attributes['displayName']) {
    return (
      <Link to={'/profiles/' + props.id}>{props.attributes['displayName'] }</Link>
    )
  }
  return <Link to={'/profiles/' + props.id}>Unknown ({props.id.firstAndLastCharacters(4)})</Link>
}

export const ProfileLink = ProfileComponent(render);

export default ProfileLink;
