import * as React from 'react';
import * as classNames from 'classnames';

import { ClassNameProps } from '../../../common';
import { Attribute, AttributeProps } from './Attribute';

import './Attributes.scss';

type PickedAttributeProps = Pick<AttributeProps, 'keyName' | 'value' | 'optional' >;

interface AttributesState {
  readonly attributes: ReadonlyArray<PickedAttributeProps>;
}

export class Attributes extends React.Component<ClassNameProps, AttributesState> {
  private attributes?: Attribute[] = [];
  private readonly defaultAttributes: ReadonlyArray<PickedAttributeProps> =
    ['name', 'author', 'dateCreated', 'datePublished'].map(keyName => ({keyName, value: ''}));

  constructor() {
    super(...arguments);
    this.state = {
      attributes: [ ...this.defaultAttributes ]
    }
  }

  render() {
    return (
      <section className={classNames('attributes', this.props.className)}>
        <h2>Attributes</h2>
        <main>
          { this.state.attributes.map(this.renderAttribute.bind(this)) }
        </main>
        <button
          onClick={this.onAddAttribute.bind(this)}
          className="button-secondary">Add Field</button>
      </section>
    )
  }

  private renderAttribute(attribute: PickedAttributeProps, index: number): JSX.Element {
    return <Attribute
      key={index}
      keyName={attribute.keyName}
      value={attribute.value}
      optional={attribute.optional}
      onKeyChange={this.onKeyChange.bind(this, index)}
      onValueChange={this.onValueChange.bind(this, index)}
      onRemove={this.onRemoveAttribute.bind(this, index)}
      ref={attribute => this.attributes[index] = attribute}
    />
  }

  private onValueChange(index: number, value: string) {
    const attributes = [ ...this.state.attributes ];
    attributes[index].value = value;
    this.setState({
      attributes
    });
  }

  private onKeyChange(index: number, keyName: string) {
    const attributes = [ ...this.state.attributes ];
    attributes[index].keyName = keyName;
    this.setState({
      attributes
    });
  }

  private onAddAttribute() {
    if (!this.state.attributes[this.state.attributes.length - 1].keyName) {
      this.attributes[this.attributes.length - 1].focus();
      return;
    }

    this.setState({
      attributes: [ ...this.state.attributes, {
        keyName: '',
        value: '',
        optional: true
      } ]
    })
  }

  private onRemoveAttribute(index: number) {
    this.setState({
      attributes: this.state.attributes.filter((el, idx) => idx !== index)
    });
  }
}
