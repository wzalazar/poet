import * as React from 'react'

import { connect } from 'react-redux'
import styled from 'styled-components'

import { Title, Container, Label, Field, SendButton, SendContainer } from '../atoms'

class AddField extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.handleChange = (ev) => {
      this.setState({ [ ev.target.name ]: ev.target.value })
    }
  }

  submit(ev) {
    ev.preventDefault()
    const value = this.state
    this.resetState()
    this.props.onSubmit(value.key, value.value)
  }

  resetState() {
    this.setState({ key: '', value: '' })
  }

  render() {
    return (<form onSubmit={this.submit.bind(this)}>
      <Label>Attribute Name</Label>
      <Field ref="key" value={this.state.key} onChange={this.handleChange} />
      <Label>Value</Label>
      <Field ref="value" value={this.state.value} onChange={this.shandleChange} />
      <br/>
      <SendButton>Add</SendButton>
    </form>)
  }
}

class PortfolioMain extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      fields: [],
      privateKey: ''
    }
  }

  addField(key, value) {
    const fields = [].concat(this.state.fields)
    fields.push({ key, value })
    this.setState({ fields })
  }

  submit() {
    this.props.sendClaim(this.refs.privateKey.value, this.state.fields)
  }

  render() {
    return (<Container>
      <Title>Portfolio</Title>
      <h3>Create Claim</h3>
      <ul>
      {
        this.state.fields.map((field, index) => {
            return <li key={field.key + index}> <strong>{ field.key} </strong>: {field.value} </li>
        })
      }
      </ul>
      <AddField onSubmit={this.addField.bind(this)} />
      <SendContainer>
        <SendButton onClick={this.submit.bind(this)}>Create Claim</SendButton>
      </SendContainer>
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