import * as React from 'react';

import { MediaType } from './MediaType';
import { Attributes, Attribute } from './Attributes';
import { Content } from './Content';

import './StepRegister.scss';

export interface StepRegisterData {
  readonly articleType: string;
  readonly attributes: ReadonlyArray<Attribute>;
  readonly content: string;
}

export interface StepRegisterProps {
  readonly onSubmit: (stepRegisterData: StepRegisterData) => void;
}

export class StepRegister extends React.Component<StepRegisterProps, undefined> {
  private mediaType: MediaType;
  private attributes: Attributes;
  private content: Content;

  render() {
    return (
      <section className="step-1-register">
        <MediaType ref={mediaType => this.mediaType = mediaType} />
        <Attributes ref={attributes => this.attributes = attributes} />
        <Content ref={content => this.content = content} />
        <button className="button-primary" onClick={this.submit.bind(this)}>Next</button>
      </section>
    );
  }

  private submit(): void {
    this.props.onSubmit({
      attributes: this.attributes.state.attributes,
      articleType: this.mediaType.state.subType,
      content: this.content.state.content
    });
  }
}