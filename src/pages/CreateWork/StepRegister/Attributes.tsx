import * as React from 'react';

import '../Layout.scss';

interface AttributesProps {
  className?: string;
}

export interface Attribute {
  key: string;
  value: string;
}

interface AttributesState {
  attributes: Attribute[];
}

export class Attributes extends React.Component<AttributesProps, AttributesState> {
  private readonly defaultAttributes: Attribute[] = [
    {
      key: 'Title',
      value: ''
    }
  ];

  constructor() {
    super(...arguments);
    this.state = {
      attributes: [ ...this.defaultAttributes ]
    }
  }

  render() {
    return (
      <section className={'mb-3 ' + this.props.className}>
        <h2>Attributes</h2>
        <form>
          { this.state.attributes.map(this.renderField.bind(this)) }
        </form>
        <button onClick={this.onAddAttribute.bind(this)} className="btn btn-secondary">Add Field</button>
      </section>
    )
  }

  private renderField({key, value}: Attribute, index: number): JSX.Element {
    return (
      <div key={index} className="form-group row">
        <div className="col-sm-4">
          <input onChange={this.onKeyChange.bind(this, index)} type="text" className="form-control" placeholder="Attribute Name" defaultValue={key} />
        </div>
        <div className="col-sm-8">
          <input onChange={this.onChange.bind(this, index)} type="text" className="form-control" placeholder="Attribute Value" />
        </div>
      </div>
    );
  }

  private onChange(index: number, event: any) {
    const attributes = [ ...this.state.attributes ];
    attributes[index].value = event.target.value;
    this.setState({
      attributes
    });
  }

  private onKeyChange(index: number, event: any) {
    const attributes = [ ...this.state.attributes ];
    attributes[index].key = event.target.value;
    this.setState({
      attributes
    });
  }

  onAddAttribute() {
    if (!this.state.attributes[this.state.attributes.length - 1].key) {
      // TODO: focus/highlight the last attribute, display a message 'Please fill in the Attribute Name for all fields before adding more'
      return;
    }

    this.setState({
      attributes: [ ...this.state.attributes, {
        key: '',
        value: ''
      } ]
    })
  }
}
