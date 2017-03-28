import * as React from 'react';
import { Link, browserHistory } from "react-router";
import * as classNames from 'classnames';

import { Images } from '../../images/Images';
import { Profile } from '../../Interfaces';
import { Hash } from '../../components/atoms/Hash';
import { PoetAPIResourceProvider } from '../../components/atoms/base/PoetApiResource';
import { SelectProfileById } from '../../components/atoms/Arguments';

import './Overview.scss';

interface OverviewProps extends SelectProfileById {
  readonly sessionPublicKey: string;
}

export class Overview extends PoetAPIResourceProvider<any, OverviewProps, undefined> {

  poetURL() {
    return '/profiles/' + this.props.profileId;
  }

  renderElement(props: Profile) {
    const authorized = this.props.sessionPublicKey && this.props.sessionPublicKey === this.props.profileId;
    return (
      <div className="overview col-sm-3">
        <div className={classNames('avatar', authorized && 'authorized')} onClick={authorized && this.onAvatarClick}>
          { authorized && <div className="edit"><img src={Images.Pencil} /></div> }
          <img src={props.attributes && props.attributes.imageData || Images.Anon} className="picture"/>
        </div>
        <h2>{props.attributes && props.attributes.displayName || 'Anonymous'}</h2>
        <div className="bio">{ props.attributes && props.attributes.bio }</div>
        <ul>
          { props.id && <li className="id"><div className="key">id</div><Hash className="copyable-hash-no-button" textClickable>{props.id}</Hash></li> }
          { props.attributes && props.attributes.email && <li><img src={Images.Mail} /><div>{props.attributes.email}</div></li> }
        </ul>
        <div><Link to="/account/profile">Edit Profile</Link></div>
      </div>
    )
  }

  private onAvatarClick() {
    browserHistory.push('/account/profile');
  }
}