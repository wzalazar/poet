import * as React from 'react';

import { MediaType } from './MediaType';
import { Attributes, Attribute } from './Attributes';
import { Content } from './Content';

export interface StepRegisterData {
  readonly articleType?: string;
  readonly attributes?: ReadonlyArray<Attribute>;
  readonly content?: string;
}

export interface StepRegisterProps {
  readonly onSubmit: (stepRegisterData: Attribute[]) => void;
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
    this.props.onSubmit([
      ...this.controls.attributes.state.attributes,
      { key: 'articleType', value: this.controls.mediaType.state.subType },
      { key: 'content', value: this.controls.content.state.content }
    ]);
  }
}