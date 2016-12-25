import * as React from 'react'
import fetch from 'isomorphic-fetch'
import { Table } from 'antd'

import { Title, Container, Label, Field, SendButton, SendContainer } from '../atoms'

import { connect } from 'react-redux'

class SettingsContainer extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      privateKey: localStorage.getItem('privateKey'),
      name: localStorage.getItem('name') || '',
      contactInfo: localStorage.getItem('contactInfo') || '',
    }
    this.handleChange = (ev) => {
      this.setState({
        [ev.target.name]: ev.target.value
      })
    }
  }

  store() {
    this.props.sendClaim(Object.assign({}, this.state))
    localStorage.setItem('privateKey', this.state.privateKey)
    localStorage.setItem('name', this.state.name)
    localStorage.setItem('contactInfo', this.state.contactInfo)
  }

  render() {
    return (<Container>
      <Title>Profile</Title>
      <Label>Private Key</Label>
      <Field disabled name='privateKey' value={this.state.privateKey}  onChange={this.handleChange} />
      <Label>Display Name</Label>
      <Field name='name' value={this.state.name}        onChange={this.handleChange} placeholder='John Dorian' />
      <Label>Contact Information</Label>
      <Field name='contactInfo' value={this.state.contactInfo} onChange={this.handleChange} placeholder='john@example.com' />

      <SendContainer>
        <SendButton onClick={this.store.bind(this)}>Update</SendButton>
      </SendContainer>
    </Container>)
  }
}

export const Settings = connect(state => ({
  sendClaim: function(attributes) {
    const privateKey = localStorage.getItem('privateKey')
    delete attributes.privateKey
    state.connection.socket.send(
      {
        action: 'create claim',
        type: 'Profile', privateKey, attributes }
    )
  }
}))(SettingsContainer)