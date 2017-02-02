import * as React from 'react';

export interface ChckboxProps {
  text: string;
}

export class Checkbox extends React.Component<ChckboxProps, undefined> {
  render() {
    return (
      <label className="custom-control custom-checkbox">
        <input type="checkbox" className="custom-control-input" />
        <span className="custom-control-indicator" />
        <span className="custom-control-description">{this.props.text}</span>
      </label>
    );
  }
}