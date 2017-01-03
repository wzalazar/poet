import * as React from "react";
import { connect } from "react-redux";

import { State } from "./HelloWorldState";
import { IncreaseCountButton } from "./IncreaseCountButton";
import { DecreaseCountButton } from './DecreaseCountButton';

export interface HelloProps {
  count: number;
}

export class HelloComponent extends React.Component<HelloProps, undefined> {

  render() {
    return (
      <div>
        <h1>Current count: {this.props.count || 0}.</h1>
        <IncreaseCountButton>Increase</IncreaseCountButton>
        <DecreaseCountButton>Decrease</DecreaseCountButton>
      </div>
    )
  }
}

export const Hello = connect((state: State) => state)(HelloComponent);
