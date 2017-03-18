import * as React from 'react';

import '../../extensions/String';

import { Images } from '../../images/Images';
import { Work } from '../../Interfaces';
import WorkComponent from '../../components/hocs/WorkComponent';
import { ProfileNameWithLink } from '../../components/atoms/Profile';

import './Title.scss';

function render(props: Work): JSX.Element {
  const owner = props.title && props.title.attributes && props.title.attributes.owner
  return (
    <section className="title">
      <h3>Owner</h3>
      <div className="wrapper">
        <img src={Images.Anon} />
        <ProfileNameWithLink profileId={owner} />
      </div>
    </section>
  )
}

export default WorkComponent(render);