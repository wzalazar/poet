import * as React from 'react';

import { MediaType } from './MediaType';
import { Attributes } from './Attributes';
import { Content } from './Content';

export interface StepRegisterData {
  articleType?: string;
  attributes?: {[key: string]: string};
  content?: string;
}

export interface StepRegisterProps {
  onSubmit: (stepRegisterData: StepRegisterData) => void;
}

export class StepRegister extends React.Component<StepRegisterProps, undefined> {
  private controls: {
    mediaType?: MediaType,
    attributes?: Attributes,
    content?: Content
  } = {};

  render() {
    return (
      <section className="step-1-register">
        <h2>Register a New Work</h2>
        <MediaType ref={mediaType => this.controls.mediaType = mediaType} className="media-type mb-3" />
        <Attributes ref={attributes => this.controls.attributes = attributes} className="fields"/>
        <Content ref={content => this.controls.content = content} className="mb-3"/>
        <button className="btn btn-primary" onClick={this.submit.bind(this)}>Next</button>
      </section>
    );
  }

  private submit(): void {
    this.props.onSubmit({
      articleType: this.controls.mediaType.state.subType,
      attributes: this.controls.attributes.state.attributes,
      content: this.controls.content.state.content
    });
  }
}