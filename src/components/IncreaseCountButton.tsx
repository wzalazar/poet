import * as React from "react";
import {connect} from "react-redux";
import {Action} from "redux";

export interface IncreaseCountButtonProps {
  increase: () => Action
}

export class IncreaseCountButtonContainer extends React.Component<IncreaseCountButtonProps, undefined> {
  render() {
    return <a href="#" onClick={this.props.increase} >{this.props.children}</a>;
  }
}

export const IncreaseCountButton = connect(() => ({}), { increase: () => ({ type: 'increase requested' }) })(IncreaseCountButtonContainer)
