import * as React from 'react';
const classNames = require('classnames');

import { ClassNameProps } from '../../common';

export interface CopyableTextProps extends ClassNameProps {
  readonly text: string;
}

export class CopyableText extends React.Component<CopyableTextProps, undefined> {
  private input: HTMLInputElement;

  render() {
    return (
      <div className={classNames(this.props.className)}>
        <input
          type="text"
          value={this.props.text}
          ref={input => this.input = input}
          readOnly />
        <button onClick={this.onClick.bind(this)}>COPY</button>
        <div className="value">{this.props.children || this.props.text}</div>
      </div>
    );
  }

  private onClick() {
    this.input.select();
    document.execCommand('copy');
  }
}