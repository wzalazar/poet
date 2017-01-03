import * as React from "react";

import { IncreaseCountButton } from "./IncreaseCountButton";
import { DecreaseCountButton } from './DecreaseCountButton';

import './HelloWorld.scss';

export interface HelloWorldProps {
  count: number
}

export class HelloWorldComponent extends React.Component<HelloWorldProps, undefined> {
  render() {
    return (
      <div className="helloWorld">
        <h1>Current count: {this.props.count || 0}.</h1>
        <IncreaseCountButton>Increase</IncreaseCountButton>
        <DecreaseCountButton>Decrease</DecreaseCountButton>
      </div>
    )
  }
}
