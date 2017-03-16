import * as React from 'react';
import { Action } from 'redux';
import * as classNames from 'classnames';

import { Configuration } from '../../../configuration';

import { PROFILE, Claim } from '../../../Claim';
import { ImageUpload } from '../../../components/ImageUpload';
import { Images } from '../../../images/Images';

import './Layout.scss';
import { ClassNameProps } from "../../../common";

export interface ProfileAttributes {
  readonly displayName?: string;
  readonly name?: string;
  readonly bio?: string;
  readonly url?: string;
  readonly email?: string;
  readonly location?: string;
  readonly avatarImageData?: string;
}

export interface UserProfileProps extends ProfileAttributes {
  readonly submitProfileRequested?: (payload: Claim) => Action;
}

export class ProfileLayout extends React.Component<UserProfileProps, ProfileAttributes> {

  constructor(props: UserProfileProps) {
    super(...arguments);
    this.state = ProfileLayout.propsToState(props)
  }

  componentWillReceiveProps(props: UserProfileProps) {
    const propsChanged = () => {
      return !(
        this.props.displayName === props.displayName &&
          this.props.name === props.name &&
          this.props.bio === props.bio &&
          this.props.url === props.url &&
          this.props.email === props.email &&
          this.props.avatarImageData === props.avatarImageData &&
          this.props.location === props.location
      )
    };
    if (!propsChanged())
      return;
    this.setState(ProfileLayout.propsToState(props))
  }

  private static propsToState(props: UserProfileProps) {
    return {
      displayName: props.displayName,
      name: props.name,
      bio: props.bio,
      url: props.url,
      email: props.email,
      avatarImageData: props.avatarImageData,
      location: props.location
    }
  }

  render() {
    return (
      <section className="container page-account-profile">
        <h1>Profile</h1>
        <div className="row">
          <main className="col-12 col-lg-10 col-xl-8">
            <div className="row">
              <div className="col-sm-6 col-md-7">
                <ProfileLayoutRow label="Display Name" small="Pick a name you will go by">
                  <input
                    type="text"
                    onChange={(event: any) => this.setState({displayName: event.target.value})}
                    placeholder="Display Name"
                    value={this.state.displayName}/>
                </ProfileLayoutRow>
                <ProfileLayoutRow label="Full Name">
                  <input
                    type="text"
                    onChange={(event: any) => this.setState({name: event.target.value})}
                    placeholder="Full Name"
                    value={this.state.name}/>
                </ProfileLayoutRow>
                <ProfileLayoutRow label="Bio">
                  <textarea
                    onChange={(event: any) => this.setState({bio: event.target.value})}
                    placeholder="Bio"
                    value={this.state.bio}/>
                </ProfileLayoutRow>
                <ProfileLayoutRow label="Url">
                  <input
                    type="text"
                    onChange={(event: any) => this.setState({url: event.target.value})}
                    placeholder="Url"
                    value={this.state.url}/>
                </ProfileLayoutRow>
                <ProfileLayoutRow label="Email">
                  <input
                    type="text"
                    onChange={(event: any) => this.setState({email: event.target.value})}
                    placeholder="Email"
                    value={this.state.email}/>
                </ProfileLayoutRow>
                <ProfileLayoutRow label="Location">
                  <input
                    type="text"
                    onChange={(event: any) => this.setState({location: event.target.value})}
                    placeholder="Location"
                    value={this.state.location}/>
                </ProfileLayoutRow>
              </div>
              <div className="col-sm-1" />
              <div className="col-sm-4 col-md-3 flex-xs-first flex-sm-last">
                <div className="profile-picture field">
                  <ImageUpload
                    className="image-upload"
                    classNames={[this.state.avatarImageData && 'loaded']}
                    buttonClassName="button-secondary"
                    imageWidthLimit={Configuration.imageUpload.maxWidth}
                    imageHeightLimit={Configuration.imageUpload.maxHeight}
                    imageData={this.state.avatarImageData || Images.Anon}
                    fileSizeLimit={Math.pow(1024, 2) * 20}
                    onChange={imageDataUrl => this.setState({avatarImageData: imageDataUrl})}
                  />
                  <small>Up to 20 MB</small>
                </div>
              </div>
            </div>
            <button onClick={this.onSubmit.bind(this)} className="button-primary">Save Changes</button>
          </main>
        </div>
      </section>
    );
  }

  private onSubmit() {
    this.props.submitProfileRequested({
      type: PROFILE,
      attributes: {
        displayName: this.state.displayName,
        name: this.state.name,
        bio: this.state.bio,
        url: this.state.url,
        email: this.state.email,
        location: this.state.location,
        imageData: this.state.avatarImageData
      }
    });
  }
}

interface ProfileLayoutProps extends ClassNameProps {
  readonly label: string;
  readonly small?: string;
}

class ProfileLayoutRow extends React.Component<ProfileLayoutProps, undefined> {
  render() {
    return (
      <div className={classNames('field', this.props.className)}>
        <label>{ this.props.label }</label>
        <div>
          { this.props.children }
        </div>
        { this.props.small && <small>{this.props.small}</small>  }
      </div>
    );
  }
}