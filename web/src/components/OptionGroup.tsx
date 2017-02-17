import * as React from 'react';
const classNames = require('classnames');

import { ClassNameProps } from '../common';

export interface OptionsProps extends ClassNameProps {
  readonly selectedId: string;
  readonly onOptionSelected: (id: string) => void;
}

export class OptionGroup extends React.Component<OptionsProps, undefined> {
  render() {
    return (
      <ol className={classNames(this.props.className)} >
        { React.Children.map(this.props.children, this.renderOption.bind(this)) }
      </ol>
    )
  }

  private renderOption(child: any, index: number) { // TODO: child should be of type React.ReactChild or ReactElement<P>
    return (
      React.cloneElement(child, {
        onClick: () => { this.props.onOptionSelected(child.props.id) },
        isSelected: child.props.id === this.props.selectedId
      })
    )
  }
}

export interface OptionProps {
  readonly id: string;
  readonly isSelected?: boolean;
  readonly onClick?: () => void;
}

export class Option extends React.Component<OptionProps, undefined> {
  render() {
    return (
      <li key={this.props.id} className={classNames(this.props.isSelected && 'selected')} onClick={() => this.props.onClick()}>
        {this.props.children}
      </li>
    )
  }
}