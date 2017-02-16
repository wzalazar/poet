import * as React from 'react';

import { MediaType } from './MediaType';
import { Attributes, Attribute } from './Attributes';
import { Content } from './Content';

import './StepRegister.scss';

const bitcore = require('bitcore-lib')

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

// http://stackoverflow.com/questions/18679576/counting-words-in-string
function countWords(s: string){
  s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
  s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
  s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
  return s.split(' ').length;
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
        <Content ref={content => this.content = content} onChange={this.listenChanges.bind(this)}/>
        <button className="button-primary" onClick={this.submit.bind(this)}>Next</button>
      </section>
    );
  }

  private listenChanges(value: string) {
    const newAttributes = [].concat(this.attributes.state.attributes)
    const hasAttribute = (attributeName: string) => this.attributes.state.attributes.filter(attribute => attribute.key === attributeName).length > 0
    const currentValue = (attributeName: string) => this.attributes.state.attributes.filter(attribute => attribute.key === attributeName)[0]
    const updateAttribute = (key: string, value: string) => newAttributes.filter(attribute => attribute.key === key)[0].value = value
    const addAttribute = (key: string, value: string) => newAttributes.push({ key, value })
    const upsertAttribute = (key: string, value: string) => hasAttribute(key) ? updateAttribute(key, value) : addAttribute(key, value)

    if (!hasAttribute('name') || !currentValue('name').value) {
      upsertAttribute('name',  this.content.upload.components.fileInput.files[0].name)
    }
    upsertAttribute('contentHash', new Buffer(bitcore.crypto.Hash.sha256(new Buffer(value))).toString('hex'))
    upsertAttribute('fileSize', '' + value.length)
    upsertAttribute('wordCount', '' + countWords(value))
    upsertAttribute('createdAt', '' + new Date().getTime())

    this.attributes.setState({ attributes: newAttributes })
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