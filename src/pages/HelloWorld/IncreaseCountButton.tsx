import * as React from "react";
import { Action } from "redux";
import { connect } from "react-redux";

import * as constants from '../../constants';

interface IncreaseCountButtonProps {
  increase: () => Action
}

class IncreaseCountButtonContainer extends React.Component<IncreaseCountButtonProps, undefined> {
  render() {
    return <a className="button" href="#" onClick={this.props.increase}>{this.props.children}</a>;
  }
}

export const IncreaseCountButton = connect(() => ({}), {
  increase: () => ({ type: constants.requestIncrement })
})(IncreaseCountButtonContainer);
