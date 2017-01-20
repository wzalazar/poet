import * as React from 'react';

import '../Layout.scss';

interface AttributesProps {
  className?: string;
}

interface Attribute {key: string, value: string}

interface AttributesState {
  attributes: Attribute[]
}

export class Attributes extends React.Component<AttributesProps, AttributesState> {
  private readonly defaultFields = [
    {
      key: 'email',
      value: 'Email'
    },
    {
      key: 'content-url',
      value: 'Content URL'
    }
  ];

  constructor() {
    super(...arguments);
    this.state = {
      attributes: [...this.defaultFields]
    }
  }

  render() {
    return (
    <section className={'mb-3 ' + this.props.className}>
      <h2>Fields</h2>
      <form>
        { this.state.attributes.map(this.renderField.bind(this)) }
      </form>
      <button className="btn btn-secondary">Add Field</button>
    </section>
    )
  }

  private renderField({key, value}: Attribute, index: number): JSX.Element {
    return (
      <div key={key} className="form-group row">
        <label htmlFor={`input${key}`} className="col-sm-2 col-form-label">{key}</label>
        <div className="col-sm-10">
          <input onChange={this.onChange.bind(this, index)} type="text" className="form-control" id={`input${key}`} placeholder={key} />
        </div>
      </div>
    );
  }

  private onChange(index: number, event: any) {
    const attributes = [...this.state.attributes];
    attributes[index].value = event.target.value;
    this.setState({
      attributes
    })
  }
}
