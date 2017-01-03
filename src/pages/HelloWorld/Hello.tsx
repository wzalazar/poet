import * as React from "react";
import {connect} from "react-redux";
import {IncreaseCountButton} from "./IncreaseCountButton";
import {State} from "../../state";

export interface HelloProps {
  count: number;
}

export class HelloComponent extends React.Component<HelloProps, undefined> {

  render() {
    return (
      <div>
        <h1>Current count: {this.props.count || 0}.</h1>
        <IncreaseCountButton>Increase</IncreaseCountButton>
      </div>
    )
  }
}

export const Hello = connect((state: State) => state)(HelloComponent);
