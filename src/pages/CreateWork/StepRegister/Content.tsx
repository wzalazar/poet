import * as React from 'react';

import '../Layout.scss';

interface ContentProps {
  className?: string;
}

interface ContentState {
  content: string;
}

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
          <div className="form-group row">
            <label htmlFor={`inputContent`} className="col-sm-2 col-form-label">Content</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id={`inputContent`} placeholder="Content" onChange={this.onChange.bind(this)} />
            </div>
          </div>
          <input type="file" accept="*/*" name="file" />
        </form>
      </section>
    )
  }

  private onChange(event: any) {
    this.setState({
      content: event.target.value
    })
  }
}
