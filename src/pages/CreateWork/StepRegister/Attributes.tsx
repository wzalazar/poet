import * as React from 'react';

import '../Layout.scss';

interface AttributesProps {
  className?: string;
}

interface AttributesState {
  attributes: {[key: string]: string}
}

export class Attributes extends React.Component<AttributesProps, AttributesState> {
  private readonly defaultAttributes = {
    'email': 'Email',
    'content-url': 'Content URL'
  };

  constructor() {
    super(...arguments);
    this.state = {
      attributes: { ...this.defaultAttributes }
    }
  }

  render() {
    return (
    <section className={'mb-3 ' + this.props.className}>
      <h2>Fields</h2>
      <form>
        { Object.keys(this.state.attributes).map(this.renderField.bind(this)) }
      </form>
      <button className="btn btn-secondary">Add Field</button>
    </section>
    )
  }

  private renderField(key: string): JSX.Element {
    return (
      <div key={key} className="form-group row">
        <label htmlFor={`input${key}`} className="col-sm-2 col-form-label">{key}</label>
        <div className="col-sm-10">
          <input onChange={this.onChange.bind(this, key)} type="text" className="form-control" id={`input${key}`} placeholder={key} />
        </div>
      </div>
    );
  }

  private onChange(key: string, event: any) {
    this.setState({
      attributes: {
        ...this.state.attributes,
        [key]: event.target.value
      }
    })
  }
}
