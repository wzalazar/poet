import * as React from "react";

export interface WorldProps { someMessage: string;  }

export class World extends React.Component<WorldProps, undefined> {
  render() {
    return <h2>Nested element {this.props.someMessage}</h2>;
  }
}
