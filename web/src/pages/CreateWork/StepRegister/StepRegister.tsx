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
  readonly content?: string;
}

// http://stackoverflow.com/questions/18679576/counting-words-in-string
function countWords(s: string) {
  s = s.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
  s = s.replace(/[ ]{2,}/gi," ");//2 or more space to 1
  s = s.replace(/\n /,"\n"); // exclude newline with a start spacing
  return s.split(' ').length;
}

export class StepRegister extends React.Component<StepRegisterProps, StepRegisterState> {
  private attributes: Attributes;

  constructor() {
    super(...arguments);
    this.state = {
      mediaType: 'article',
      articleType: 'news-article',
      content: ''
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
        <Content
          content={this.state.content}
          onChange={this.onContentChange.bind(this)}
          onFileNameChange={this.onContentFileNameChange.bind(this)} />
        <button className="button-primary" onClick={this.submit.bind(this)}>Next</button>
      </section>
    );
  }

  private onContentChange(content: string) {
    this.setState({ content });
    this.contentToAttributes(content);
  }

  private onContentFileNameChange(fileName: string) {
    this.contentToAttributes(null, fileName);
  }

  private contentToAttributes(content?: string, fileName?: string) {
    const attributes = [...this.attributes.state.attributes];

    const attributeByKey = (key: string) => this.attributes.state.attributes.find(attribute => attribute.key === key);
    const updateAttribute = (key: string, value: string) => attributeByKey(key).value = value;
    const addAttribute = (key: string, value: string) => attributes.push({ key, value });
    const upsertAttribute = (key: string, value: string) => attributeByKey(key) ? updateAttribute(key, value) : addAttribute(key, value);

    if (fileName && !attributeByKey('name') || !attributeByKey('name').value) {
      upsertAttribute('name',  fileName)
    }

    if (content) {
      upsertAttribute('contentHash', new Buffer(bitcore.crypto.Hash.sha256(new Buffer(content))).toString('hex'));
      upsertAttribute('fileSize', '' + content.length);
      upsertAttribute('wordCount', '' + countWords(content));
      upsertAttribute('dateCreated', '' + new Date().getTime());
    }

    this.attributes.setState({ attributes })
  }

  private submit(): void {
    this.props.onSubmit({
      attributes: this.attributes.state.attributes,
      mediaType: this.state.mediaType,
      articleType: this.state.articleType,
      content: this.state.content
    });
  }
}