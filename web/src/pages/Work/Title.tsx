import * as React from 'react';

import '../../extensions/String';

import { Work } from '../../Interfaces';
import WorkComponent from '../../components/hocs/WorkComponent';
import { ProfileNameWithLink, ProfilePictureById } from '../../components/atoms/Profile';

import './Title.scss';

function render(props: Work): JSX.Element {
  const owner = props.title && props.title.attributes && props.title.attributes.owner;
  return (
    <section className="title">
      <h3>Owner</h3>
      <main className="wrapper">
        <ProfilePictureById profileId={owner} className="profile-picture" />
        <ProfileNameWithLink profileId={owner} />
      </main>
    </section>
  )
}

export default WorkComponent(render);