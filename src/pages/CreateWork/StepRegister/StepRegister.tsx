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
  private readonly MEDIA_TYPE = 'mediaType';
  private readonly ATTRIBUTES = 'attributes';
  private readonly CONTENT = 'content';

  render() {
    return (
      <section className="step-1-register">
        <h2>Register a New Work</h2>
        <MediaType ref={this.MEDIA_TYPE} className="media-type mb-3" />
        <Attributes ref={this.ATTRIBUTES} className="fields"/>
        <Content ref={this.CONTENT} className="mb-3"/>
        <button className="btn btn-primary" onClick={this.submit.bind(this)}>Next</button>
      </section>
    );
  }

  private submit(): void {
    this.props.onSubmit({
      articleType: (this.refs[this.MEDIA_TYPE] as any).state.subType,
      attributes: (this.refs[this.ATTRIBUTES] as any).state.attributes,
      content: (this.refs[this.CONTENT] as any).state.content
    });
  }
}