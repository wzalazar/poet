import * as React from "react";
import { connect } from "react-redux";

import { State } from '../../state';

import { IncreaseCountButton } from "./IncreaseCountButton";
import { DecreaseCountButton } from './DecreaseCountButton';

import './HelloWorld.scss';

export interface HelloWorldProps {
  count: number
}

class HelloWorldComponent extends React.Component<HelloWorldProps, undefined> {

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

export const HelloWorld = connect((state: State) => state.helloWorldState)(HelloWorldComponent);
