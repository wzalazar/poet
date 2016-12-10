import * as React from 'react'
import fetch from 'isomorphic-fetch'
import { Table } from 'antd'

import styled from 'styled-components'

const Title = styled.h3`
  font-size: 16px;
  margin-bottom: 20px;
`

const Container = styled.div`
  padding-top: 80px;
  padding-left: 5%;
  padding-right: 5%;
`

import { connect } from 'react-redux'

class ProfileContainer extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      privateKey: localStorage.getItem('privateKey'),
      name: localStorage.getItem('name'),
      contactInfo: localStorage.getItem('contactInfo'),
    }
    this.handleChange = (ev) => {
      this.setState({
        [ev.target.name]: ev.target.value
      })
    }
  }

  store() {
    this.createClaim(this.state)
    localStorage.setItem('privateKey', this.state.privateKey)
  }

  render() {
    return (<Container>
    </Container>)
  }
}

export const Profile = connect(state => ({
  sendClaim: function(attributes) {
    const privateKey = localStorage.getItem('privateKey')
    state.connection.socket.send(
      {
        action: 'create claim',
        type: 'Profile', privateKey, attributes }
    )
  }
}))(ProfileContainer)