import * as React from "react";
import { connect } from "react-redux";
import { Action } from "redux";

export interface DecreaseCountButtonProps {
  decrease: () => Action
}

export class DecreaseCountButtonContainer extends React.Component<DecreaseCountButtonProps, undefined> {
  render() {
    return <a href="#" onClick={this.props.decrease}>{this.props.children}</a>;
  }
}

export const DecreaseCountButton = connect(() => ({}), { decrease: () => ({ type: 'decrease requested' }) })(DecreaseCountButtonContainer)
