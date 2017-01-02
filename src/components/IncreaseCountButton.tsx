import * as React from "react";

export interface IncreaseCountButtonProps { text: string; onClick: any; }

export class IncreaseCountButton extends React.Component<IncreaseCountButtonProps, undefined> {
  render() {
    return <a href="#" onClick={this.props.onClick} >{this.props.text}</a>;
  }
}
