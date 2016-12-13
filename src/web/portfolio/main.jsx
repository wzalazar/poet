import * as React from 'react'

import { Link } from 'react-router'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { Title, Container, Label, Field, SendButton, SendContainer, LinkButton } from '../atoms'

class PortfolioMain extends React.Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (<Container>
      <h2>Portfolio</h2>
      <Link to='/portfolio/new'>New Work</Link>
    </Container>)
  }
}

export const Portfolio = connect(state => ({
  sendClaim: function(attributes) {
    const privateKey = localStorage.getItem('privateKey')
    state.connection.socket.send(
      { action: 'create claim', type: 'CreativeWork', privateKey, attributes }
    )
  }
}))(PortfolioMain)