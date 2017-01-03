import * as React from "react";
import { connect } from "react-redux";

import { IncreaseCountButton } from "./IncreaseCountButton";
import { DecreaseCountButton } from './DecreaseCountButton';
import { HelloWorldState } from './HelloWorldState';

export interface HelloProps {
  count: number
}

class HelloWorldComponent extends React.Component<HelloProps, undefined> {

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

export const HelloWorld = connect((state: any) => state.helloWorldState)(HelloWorldComponent);
