import * as React from "react";
import { createStore, Action } from 'redux';
import { Provider, connect } from 'react-redux';

import { IncreaseCountButton } from "./IncreaseCountButton";
import { State } from "../state";

export interface HelloProps {
  count: number;
  increase: () => Action
}

export class HelloComponent extends React.Component<HelloProps, undefined> {

  onClick() {
    this.props.increase();
  }

  render() {
    return (
      <div>
        <h1>Current count: {this.props.count || 0}.</h1>
        <IncreaseCountButton text="Increase Count" onClick={this.onClick.bind(this)}/>
      </div>
    )
  }
}

export const Hello = connect((state: State) => state, {increase: () => ({type: 'increase'})})(HelloComponent);
