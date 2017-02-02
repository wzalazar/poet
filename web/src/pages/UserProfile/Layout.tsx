import * as React from 'react';

import './Layout.scss';

import Config from '../../config';

import { ImageUpload } from '../../components/ImageUpload';

import { UserProfileProps } from './Loader';
import { PROFILE } from '../../Claim';

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

export class ProfileLayout extends React.Component<UserProfileProps, undefined> {
  private readonly controls: {
    displayNameInput?: HTMLInputElement;
    emailInput?: HTMLInputElement;
    imageUpload?: ImageUpload;
    currencyInput?: HTMLInputElement;

  } = {};

  render() {
    return (
      <section className="user-edit">
        <div className="header">
          <h2>Edit profile</h2>
        </div>
        <form className="container">
          <div className="form-group">
            <ProfileLayoutRow label="Display name">
              <input ref={displayNameInput => this.controls.displayNameInput = displayNameInput} className="form-control" defaultValue={this.props.displayName}/>
            </ProfileLayoutRow>
            <ProfileLayoutRow label="Email">
              <input ref={emailInput => this.controls.emailInput = emailInput} className="form-control" defaultValue={this.props.email} />
            </ProfileLayoutRow>
            <ProfileLayoutRow label="Image">
              <ImageUpload
                ref={imageUpload => this.controls.imageUpload = imageUpload}
                className="image-upload"
                buttonClassName="btn btn-primary"
                imageWidthLimit={Config.imageUpload.maxWidth}
                imageHeightLimit={Config.imageUpload.maxHeight}
              />
            </ProfileLayoutRow>
            <ProfileLayoutRow label="Preferred currency">
              <input ref={currencyInput => this.controls.currencyInput = currencyInput} className="form-control" defaultValue={this.props.currency}/>
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
        displayName: this.controls.displayNameInput.value,
        email: this.controls.emailInput.value,
        imageData: this.controls.imageUpload.state.imageData,
        currency: this.controls.currencyInput.value
      }
    });
  }
}
