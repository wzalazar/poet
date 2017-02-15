import * as React from 'react';

import '../Layout.scss';
import './Content.scss';

import { TextUpload } from '../../../components/TextUpload';

interface ContentState {
  readonly content: string;
}

export class Content extends React.Component<undefined, ContentState> {

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
            className="text-upload"
            buttonClassName="btn btn-secondary"
            onChange={this.onChange.bind(this)}
            placeholder="Content" />
        </form>
      </section>
    )
  }

  private onChange(value: string) {
    this.setState({
      content: value
    })
  }
}
