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

  renderElement(profile: Profile) {
    const isAuthorized = this.props.sessionPublicKey && (this.props.sessionPublicKey === this.props.profileId);

    if (profile) {
      return this.renderProfile(profile, isAuthorized);
    } else {
      return this.renderNoProfile(isAuthorized);
    }
  }

  renderLoading() {
    return this.renderProfile({
      id: 'Id',
      displayName: 'Name',
      attributes: {
        bio: 'Bio',
        email: 'Email',
        displayName: 'Name'
      }
    }, false, true);
  }

  componentWillUnmount() {
    document.title = 'Poet';
  }

  private renderProfile(profile: Profile, isAuthorized: boolean, isLoading?: boolean) {
    document.title = profile.displayName || 'Profile';
    return (
      <div className={classNames('overview', 'col-sm-3', isLoading && 'loading')}>
        <div className={classNames('avatar', isAuthorized && 'authorized')} onClick={isAuthorized && this.onAvatarClick}>
          { isAuthorized && <div className="edit"><img src={Images.Pencil} /></div> }
          <img src={profile.attributes && profile.attributes.imageData || Images.Anon} className="picture"/>
        </div>
        <h2>{profile.attributes && profile.attributes.displayName || 'Anonymous'}</h2>
        <div className="bio">{ profile.attributes && profile.attributes.bio }</div>
        <ul>
          { profile.id && <li className="id"><div className="key">id</div><Hash className="copyable-hash-no-button" textClickable>{profile.id}</Hash></li> }
          { profile.attributes && profile.attributes.email && <li><img src={Images.Mail} /><div>{profile.attributes.email}</div></li> }
        </ul>
        { isAuthorized && <div><Link to="/account/profile" className="button-secondary edit-profile" >Edit Profile</Link></div> }
      </div>
    )
  }

  private renderNoProfile(isAuthorized: boolean) {
    return (
      <div className="overview col-sm-3">
        <div className={classNames('avatar', isAuthorized && 'authorized')} onClick={isAuthorized && this.onAvatarClick}>
          { isAuthorized && <div className="edit"><img src={Images.Pencil} /></div> }
          <img src={Images.Anon} className="picture"/>
        </div>
        <h2>Anonymous</h2>
        <div className="bio">...</div>
        <div><Link to="/account/profile">Edit Profile</Link></div>
      </div>
    )
  }

  private onAvatarClick = () => {
    browserHistory.push('/account/profile');
  }
}