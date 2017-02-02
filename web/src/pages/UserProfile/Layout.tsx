import * as React from 'react';
import { Action } from 'redux';

import Config from '../../config';

import { PROFILE, Claim } from '../../Claim';
import { ImageUpload } from '../../components/ImageUpload';

import './Layout.scss';

export interface ProfileAttributes {
  readonly displayName?: string;
  readonly email?: string;
  readonly avatarImageData?: string;
  readonly currency?: string;
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
    this.setState(ProfileLayout.propsToState(props))
  }

  private static propsToState(props: UserProfileProps) {
    return {
      displayName: props.displayName,
      email: props.email,
      currency: props.currency,
      avatarImageData: props.avatarImageData
    }
  }

  render() {
    return (
      <section className="user-edit">
        <div className="header">
          <h2>Edit profile</h2>
        </div>
        <form className="container">
          <div className="form-group">
            <ProfileLayoutRow label="Display name">
              <input
                onChange={(event: any) => this.setState({displayName: event.target.value})}
                className="form-control"
                value={this.state.displayName}/>
            </ProfileLayoutRow>
            <ProfileLayoutRow label="Email">
              <input
                onChange={(event: any) => this.setState({email: event.target.value})}
                className="form-control"
                value={this.state.email}/>
            </ProfileLayoutRow>
            <ProfileLayoutRow label="Image">
              <ImageUpload
                className="image-upload"
                buttonClassName="btn btn-primary"
                imageWidthLimit={Config.imageUpload.maxWidth}
                imageHeightLimit={Config.imageUpload.maxHeight}
                imageData={this.state.avatarImageData}
                onChange={imageDataUrl => this.setState({avatarImageData: imageDataUrl})}
              />
            </ProfileLayoutRow>
            <ProfileLayoutRow label="Preferred currency">
              <input
                onChange={(event: any) => this.setState({currency: event.target.value})}
                className="form-control"
                value={this.state.currency}/>
            </ProfileLayoutRow>
          </div>
        </form>
        <button onClick={this.onSubmit.bind(this)} className="btn btn-primary outlined">Save</button>
      </section>
    );
  }

  private onSubmit() {
    this.props.submitProfileRequested({
      type: PROFILE,
      attributes: {
        displayName: this.state.displayName,
        email: this.state.email,
        imageData: this.state.avatarImageData,
        currency: this.state.currency
      }
    });
  }
}

class ProfileLayoutRow extends React.Component<any, undefined> {
  render() {
    return (
      <div className="form-group">
        <div className="row">
          <label className="col-sm-3 col-form-label">{ this.props.label }</label>
          <div className="col-sm-9">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }
}