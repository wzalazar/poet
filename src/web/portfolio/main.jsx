import * as React from 'react'

import styled from 'styled-components'

const Container = styled.div`
  padding-top: 80px;
  padding-left: 5%;
  padding-right: 5%;
`

const ClaimCreator = styled.div`
  padding: 30px;
  border: 1px solid #333;
  border-radius: 4px;
  margin-top: 20px;
`

const InputGroup = styled.div``
const TextInput = styled.input``
const ClaimCreationTitle = styled.h3`
  margin-bottom: 10px;
`
const Label = styled.label`
  min-width: 100px;
  display: inline-block;
  padding-right: 10px;
`

const SendButton = styled.button`
  font-size: 18px;
  background-color: #424242;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 15px 5px 15px;
`

const SendContainer = styled.div`
  margin: 10px;
`

class AddField extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  submit(ev) {
    ev.preventDefault()
    const value = this.state
    this.resetState()
    this.props.onSubmit(value.key, value.value)
    this.refs.key.focus()
  }

  resetState() {
    this.setState({ key: '', value: '' })
    this.refs.key.value = ''
    this.refs.value.value = ''
  }

  setValues() {
    this.setState({
      key: this.refs.key.value,
      value: this.refs.value.value
    })
  }

  render() {
    return (<form onSubmit={this.submit.bind(this)}>
      <input ref="key" defaultValue={this.state.key} onChange={this.setValues.bind(this)} />
      <input ref="value" defaultValue={this.state.value} onChange={this.setValues.bind(this)} />
      <button>Add</button>
    </form>)
  }
}

import { connect } from 'react-redux'

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
      <h2>Portfolio</h2>

      <ClaimCreator>
        <ClaimCreationTitle>New Claim</ClaimCreationTitle>
        <InputGroup>
          <Label htmlFor="privateKey">Private Key</Label>
          <input name="privateKey" ref="privateKey"/>
        </InputGroup>
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
      </ClaimCreator>
    </Container>)
  }
}

export const Portfolio = connect(state => ({
  sendClaim: function(privateKey, attributes) {
    console.log('Submiting claim', privateKey, attributes)
    state.connection.socket.send(
      { action: 'create claim', type: 'CreativeWork', privateKey, attributes }
    )
  }
}))(PortfolioMain)