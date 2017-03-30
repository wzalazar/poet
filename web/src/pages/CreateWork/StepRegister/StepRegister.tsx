import * as React from 'react';
const bitcore = require('bitcore-lib');

import { KeyValue } from '../../../common';
import { wordCount } from '../../../helpers/StringHelper';
import { MediaType } from './MediaType';
import { Attributes } from './Attributes';
import { AttributeData } from './Attribute';
import { Content } from './Content';

import './StepRegister.scss';

export interface StepRegisterData {
  readonly articleType: string;
  readonly mediaType: string;
  readonly attributes: ReadonlyArray<KeyValue>;
  readonly content: string;
}

export interface StepRegisterProps {
  readonly onSubmit: (stepRegisterData: StepRegisterData) => void;
}

interface StepRegisterState {
  readonly mediaType?: string;
  readonly articleType?: string;
  readonly content?: string;
  readonly attributes?: ReadonlyArray<AttributeData>;
  readonly displayErrors?: boolean;
}

export class StepRegister extends React.Component<StepRegisterProps, StepRegisterState> {
  constructor() {
    super(...arguments);
    this.state = {
      mediaType: 'article',
      articleType: 'news-article',
      content: '',
      attributes: ['name', 'author', 'dateCreated', 'datePublished'].map(keyName => ({keyName, value: '', keyNameReadOnly: true})),
      displayErrors: false
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
        <Attributes
          attributes={this.state.attributes}
          onChange={attributes => this.setState({ attributes })}
          displayErrors={this.state.displayErrors}/>
        <Content
          content={this.state.content}
          onChange={this.onContentChange.bind(this)}
          onFileNameChange={this.onContentFileNameChange.bind(this)} />
        <button
          className="button-primary"
          onClick={this.submit.bind(this)}
          >
          Next
        </button>
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
    const attributes = [...this.state.attributes];

    const attributeByKey = (keyName: string) => attributes.find(attribute => attribute.keyName === keyName);
    const updateAttribute = (keyName: string, value: string) => attributeByKey(keyName).value = value;
    const addAttribute = (keyName: string, value: string) => attributes.push({ keyName, value });
    const upsertAttribute = (keyName: string, value: string) => attributeByKey(keyName) ? updateAttribute(keyName, value) : addAttribute(keyName, value);

    if (fileName && !attributeByKey('name') || !attributeByKey('name').value) {
      upsertAttribute('name',  fileName)
    }

    if (content) {
      upsertAttribute('contentHash', new Buffer(bitcore.crypto.Hash.sha256(new Buffer(content))).toString('hex'));
      upsertAttribute('fileSize', '' + content.length);
      upsertAttribute('wordCount', '' + wordCount(content));
      upsertAttribute('dateCreated', '' + new Date().getTime());
    }

    this.setState({ attributes })
  }

  private submit(): void {
    if (this.gotInvalidFields()) {
      this.setState({ displayErrors: true });
      return;
    }

    this.props.onSubmit({
      attributes: this.state.attributes.map(attribute => ({key: attribute.keyName, value: attribute.value})),
      mediaType: this.state.mediaType,
      articleType: this.state.mediaType === 'article' && this.state.articleType,
      content: this.state.content
    });
  }

  private gotInvalidFields() {
    return this.state.attributes.some(attribute => !attribute.optional && !attribute.value);
  }
}