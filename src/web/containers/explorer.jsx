import * as React from 'react'

import styled from 'styled-components'

const Container = styled.div`
  padding-top: 80px;
  padding-left: 5%;
  padding-right: 5%;
`

import { connect } from 'react-redux'

class ExplorerContainer extends React.Component {
  render() {
    return (<Container>
      <h2>Explorer</h2>
      { /*<p>Connection status: { this.props.connection.state }</p> */}
    </Container>)
  }
}

export const Explorer = connect(state => ({
  connection: state.connection
}), {})(ExplorerContainer)