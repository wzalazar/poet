import * as React from 'react';

import '../Layout.scss';
import { TextUpload } from '../../../components/TextUpload';

interface ContentProps {
  readonly className?: string;
}

interface ContentState {
  readonly content: string;
}

import './Content.scss';

export class Content extends React.Component<ContentProps, ContentState> {

  constructor() {
    super(...arguments);
    this.state = {
      content: ''
    }
  }

  render() {
    return (
      <section className={this.props.className}>
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
