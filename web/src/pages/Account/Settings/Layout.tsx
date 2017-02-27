import * as React from 'react';
import { Action } from 'redux';

import Config from '../../../config';

import { PROFILE, Claim } from '../../../Claim';
import { ImageUpload } from '../../../components/ImageUpload';
import { Images } from '../../../images/Images';

import './Layout.scss';

export interface ProfileAttributes {
  readonly displayName?: string;
  readonly firstName?: string;
  readonly lastName?: string;
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
    const propsChanged = () => {
      return !(
        this.props.displayName === props.displayName &&
          this.props.firstName === props.firstName &&
          this.props.lastName === props.lastName &&
          this.props.email === props.email &&
          this.props.avatarImageData === props.avatarImageData &&
          this.props.currency === props.currency
      )
    };
    if (!propsChanged())
      return;
    this.setState(ProfileLayout.propsToState(props))
  }

  private static propsToState(props: UserProfileProps) {
    return {
      displayName: props.displayName,
      firstName: props.firstName,
      lastName: props.lastName,
      email: props.email,
      currency: props.currency,
      avatarImageData: props.avatarImageData
    }
  }

  render() {
    return (
      <section className="container user-edit">
        <div className="header">
          <h2>Profile</h2>
        </div>
        <form className="container">
          <div className="form-group">
            <ProfileLayoutRow label="Display Name">
              <input
                onChange={(event: any) => this.setState({displayName: event.target.value})}
                className="form-control"
                placeholder="Display Name"
                value={this.state.displayName}/>
            </ProfileLayoutRow>
            <ProfileLayoutRow label="Name">
              <div style={{display: 'flex'}} >
                <input
                  onChange={(event: any) => this.setState({firstName: event.target.value})}
                  className="form-control mr-2"
                  placeholder="First Name"
                  value={this.state.firstName}/>
                <input
                  onChange={(event: any) => this.setState({lastName: event.target.value})}
                  className="form-control"
                  placeholder="Last Name"
                  value={this.state.lastName}/>
              </div>
            </ProfileLayoutRow>
            <ProfileLayoutRow label="Email">
              <input
                onChange={(event: any) => this.setState({email: event.target.value})}
                className="form-control"
                placeholder="Email"
                value={this.state.email}/>
            </ProfileLayoutRow>
            <ProfileLayoutRow label="Image">
              <ImageUpload
                className="image-upload"
                classNames={[this.state.avatarImageData && 'loaded']}
                buttonClassName="button-secondary"
                imageWidthLimit={Config.imageUpload.maxWidth}
                imageHeightLimit={Config.imageUpload.maxHeight}
                imageData={this.state.avatarImageData || Images.Anon}
                fileSizeLimit={Math.pow(1024, 2) * 20}
                onChange={imageDataUrl => this.setState({avatarImageData: imageDataUrl})}
              />
            </ProfileLayoutRow>
          </div>
        </form>
        <div className="header">
          <h2>Currency</h2>
        </div>
        <form className="container">
          <div className="form-group">
            <ProfileLayoutRow label="Preferred currency">
              <input
                onChange={(event: any) => this.setState({currency: event.target.value})}
                className="form-control"
                placeholder="BTC, USD"
                value={this.state.currency}/>
            </ProfileLayoutRow>
          </div>
        </form>
        <button onClick={this.onSubmit.bind(this)} className="button-primary">Save Changes</button>
      </section>
    );
  }

  private onSubmit() {
    this.props.submitProfileRequested({
      type: PROFILE,
      attributes: {
        displayName: this.state.displayName,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
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
      <div className="form-group row">
        <label className="col-sm-3 col-form-label">{ this.props.label }</label>
        <div className="col-sm-9">
          { this.props.children }
        </div>
      </div>
    );
  }
}