import * as React from 'react';

import '../Layout.scss';

interface AttributesProps {
  readonly className?: string;
}

export interface Attribute {
  key: string;
  value: string;
}

interface AttributesState {
  readonly attributes: ReadonlyArray<Attribute>;
}

export class Attributes extends React.Component<AttributesProps, AttributesState> {
  private readonly controls: {
    attributeKeyInputs?: HTMLInputElement[];
  } = {
    attributeKeyInputs: []
  };
  private readonly defaultAttributes: ReadonlyArray<Attribute> = [
    {
      key: 'title',
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
          <input ref={this.setAttributeInputRef.bind(this, index)} onChange={this.onKeyChange.bind(this, index)} type="text" className="form-control" placeholder="Attribute Name" value={key} />
        </div>
        <div className="col-sm-7">
          <input onChange={this.onChange.bind(this, index)} type="text" className="form-control" placeholder="Attribute Value" value={value} />
        </div>
        <div className="col-sm-1">
          <button onClick={this.onRemoveAttribute.bind(this, index)} className="btn btn-secondary">X</button>
        </div>
      </div>
    );
  }

  private setAttributeInputRef(index: number, attributeKeyInput: HTMLInputElement) {
    this.controls.attributeKeyInputs[index] = attributeKeyInput;
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

  private onAddAttribute() {
    if (!this.state.attributes[this.state.attributes.length - 1].key) {
      this.controls.attributeKeyInputs[this.controls.attributeKeyInputs.length - 1].focus();
      return;
    }

    this.setState({
      attributes: [ ...this.state.attributes, {
        key: '',
        value: ''
      } ]
    })
  }

  private onRemoveAttribute(index: number, event: any) {
    event.preventDefault();
    this.setState({
      attributes: [ ...this.state.attributes.filter((el, idx) => idx !== index) ]
    });
  }
}
