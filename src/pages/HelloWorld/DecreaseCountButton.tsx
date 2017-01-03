import * as React from "react";
import { connect } from "react-redux";
import { Action } from "redux";

import * as constants from '../../constants';

interface DecreaseCountButtonProps {
  decrease: () => Action
}

class DecreaseCountButtonContainer extends React.Component<DecreaseCountButtonProps, undefined> {
  render() {
    return <a className="button" href="#" onClick={this.props.decrease}>{this.props.children}</a>;
  }
}

export const DecreaseCountButton = connect(() => ({}), {
  decrease: () => ({ type: constants.requestDecrement })
})(DecreaseCountButtonContainer);
