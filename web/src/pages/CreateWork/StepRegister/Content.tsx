import * as React from 'react';

import '../Layout.scss';
import './Content.scss';

import { TextUpload } from '../../../components/TextUpload';

interface ContentState {
  readonly content: string;
}

export interface ChangeEmitter {
  readonly onChange?: (newValue: string) => void
}

export class Content extends React.Component<ChangeEmitter, ContentState> {
  upload: TextUpload;

  constructor() {
    super(...arguments);
    this.state = {
      content: ''
    }
  }

  render() {
    return (
      <section className="content">
        <h2>Content</h2>
        <form>
          <TextUpload
            ref={upload => this.upload = upload}
            className="text-upload"
            buttonClassName="button-secondary"
            onChange={this.onChange.bind(this)}
            placeholder="Content" />
        </form>
      </section>
    )
  }

  private onChange(value: string) {
    if (this.props.onChange) {
      this.props.onChange(value)
    }
    this.setState({
      content: value
    })
  }
}
