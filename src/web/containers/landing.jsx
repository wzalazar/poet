import * as React from 'react'

import { Link } from 'react-router'

export class Landing extends React.Component {
  render() {
    return (<div>
      <h2>Landing</h2>
      <Link to="/hey">Hey</Link>
    </div>)
  }
}