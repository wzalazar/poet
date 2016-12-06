import * as React from 'react'

export class Root extends React.Component {
  render() {
    return (<div className="root">
      <div>Root navbar</div>
      { this.props.children }
    </div>)
  }
}