import * as React from 'react'

import styled from 'styled-components'

const Container = styled.div`
  padding-top: 80px;
  padding-left: 5%;
  padding-right: 5%;
`

const ClaimCreator = styled.form`
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
  padding: a fopx 15px 5px 15px;
`

const SendContainer = styled.div`
  margin: 10px;
`

class AddField extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  submit() {
    const value = this.state
    this.resetState()
    this.props.onSubmit(value.key, value.value)
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
    return (<div>
      <input ref="key" defaultValue={this.state.key} onChange={this.setValues.bind(this)} />
      <input ref="value" defaultValue={this.state.value} onChange={this.setValues.bind(this)} />
      <button onClick={this.submit.bind(this)}>Add</button>
    </div>)
  }
}

import { connect } from 'react-redux'

class PortfolioMain extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      fields: []
    }
  }

  addField(key, value) {
    const fields = [].concat(this.state.fields)
    fields.push({ key, value })
    this.setState({ fields })
  }

  render() {
    return (<Container>
      <h2>Portfolio</h2>

      <ClaimCreator>
        <ClaimCreationTitle>New Claim</ClaimCreationTitle>
        <InputGroup>
          <Label htmlFor="privateKey">Private Key</Label>
          <TextInput name="privateKey" ref="privateKey"/>
        </InputGroup>
        <ul>
        {
          this.state.fields.map(field => {
             return <li key={field.key}> <strong>{ field.key} </strong>: {field.value} </li>
          })
        }
        </ul>
        <AddField onSubmit={this.addField.bind(this)} />
        <SendContainer>
          <SendButton>Create Claim</SendButton>
        </SendContainer>
      </ClaimCreator>
    </Container>)
  }
}

export const Portfolio = connect(state => ({
  connection: state.connection
}), {})(PortfolioMain)