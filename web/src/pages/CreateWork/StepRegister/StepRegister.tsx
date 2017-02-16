import * as React from 'react';

import { MediaType } from './MediaType';
import { Attributes, Attribute } from './Attributes';
import { Content } from './Content';

import './StepRegister.scss';

export interface StepRegisterData {
  readonly articleType: string;
  readonly mediaType: string;
  readonly attributes: ReadonlyArray<Attribute>;
  readonly content: string;
}

export interface StepRegisterProps {
  readonly onSubmit: (stepRegisterData: StepRegisterData) => void;
}

interface StepRegisterState {
  readonly mediaType?: string;
  readonly articleType?: string;
}

export class StepRegister extends React.Component<StepRegisterProps, StepRegisterState> {
  private attributes: Attributes;
  private content: Content;

  constructor() {
    super(...arguments);
    this.state = {
      mediaType: 'article',
      articleType: 'news-article'
    }
  }

  render() {
    return (
      <section className="step-1-register">
        <MediaType
          mediaType={this.state.mediaType}
          articleType={this.state.articleType}
          onMediaTypeSelected={mediaType => this.setState({ mediaType })}
          onArticleTypeSelected={articleType => this.setState({ articleType })}
        />
        <Attributes ref={attributes => this.attributes = attributes} />
        <Content ref={content => this.content = content} />
        <button className="button-primary" onClick={this.submit.bind(this)}>Next</button>
      </section>
    );
  }

  private submit(): void {
    this.props.onSubmit({
      attributes: this.attributes.state.attributes,
      mediaType: this.state.mediaType,
      articleType: this.state.articleType,
      content: this.content.state.content
    });
  }
}