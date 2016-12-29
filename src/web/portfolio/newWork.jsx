import * as React from 'react'

import { connect } from 'react-redux'
import styled from 'styled-components'
import { browserHistory } from 'react-router'

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
      <Field name="key" value={this.state.key} onChange={this.handleChange} />
      <Label>Value</Label>
      <Field name="value" value={this.state.value} onChange={this.handleChange} />
      <br/>
      <SendButton>Add</SendButton>
    </form>)
  }
}

class NewWorkContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      fields: [],
      type: 'CreativeWork'
    }
  }

  addField(key, value) {
    const fields = [].concat(this.state.fields)
    fields.push({ key, value })
    this.setState({ fields })
  }

  submit() {
    this.props.sendClaim(this.refs.type.value, this.state.fields)
  }

  render() {
    return (<Container>
      <Title>Portfolio</Title>
      <h3>Create Claim</h3>
      <h4>Type</h4>
      <select ref="type">
        <option selected value="CreativeWork">Creative Work</option>
        <option value="Title">Title</option>
        <option value="License">License</option>
        <option value="Certificate">Certificate</option>
        <option value="Revokation">Revokation</option>
        <option value="Profile">Profile</option>
      </select>
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

export const NewWork = connect(state => ({}), {
  sendClaim: (type, attributes) => dispatch => {
    const privateKey = localStorage.getItem('privateKey')
    dispatch(
      {
        type: 'send websocket message',
        payload: {
          action: 'create claim',
          type,
          privateKey,
          attributes
        }
      }
    )
    browserHistory.push('/explorer')
  }
})(NewWorkContainer)